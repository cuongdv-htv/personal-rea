import http from "http";
import https from "https";
import fs from "fs";
import path from "path";

const PORT = 8888;
const ROOT = "d:/00_CODING/rea/lusion_reconstruct";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".buf": "application/octet-stream",
  ".bin": "application/octet-stream",
  ".exr": "application/octet-stream",
  ".ogg": "audio/ogg",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function fetchRemoteAsset(assetPath) {
  return new Promise((resolve) => {
    const urls = [
      `https://lusion.dev${assetPath}`,
      `https://lusion.co${assetPath}`,
    ];

    function tryFetch(index) {
      if (index >= urls.length) return resolve(null);
      const url = urls[index];
      https
        .get(url, (res) => {
          if (
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            https
              .get(res.headers.location, (fbRes) => {
                if (fbRes.statusCode !== 200) return tryFetch(index + 1);
                const chunks = [];
                fbRes.on("data", (c) => chunks.push(c));
                fbRes.on("end", () => resolve(Buffer.concat(chunks)));
              })
              .on("error", () => tryFetch(index + 1));
            return;
          }
          if (res.statusCode !== 200) {
            return tryFetch(index + 1);
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        })
        .on("error", () => tryFetch(index + 1));
    }

    tryFetch(0);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

  let filePath = path.join(ROOT, reqPath);

  // If missing asset, fetch and cache locally!
  if (!fs.existsSync(filePath) && reqPath.startsWith("/assets/")) {
    console.log(`[Cache Miss] Fetching remote: ${reqPath}`);
    const data = await fetchRemoteAsset(reqPath);
    if (data) {
      try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, data);
        console.log(
          `[Cached] Successfully saved: ${reqPath} (${data.length} bytes)`,
        );
      } catch (e) {
        console.error("Failed to save cached file:", e.message);
      }
    }
  }

  // SPA Route Fallback: Only for paths with no extension (e.g. /about, /projects)
  if (!fs.existsSync(filePath)) {
    const ext = path.extname(reqPath);
    if (!ext) {
      filePath = path.join(ROOT, "index.html");
    } else {
      console.log(`[404] Not Found: ${req.url}`);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  // Support video range requests
  const stat = fs.statSync(filePath);
  const total = stat.size;
  const range = req.headers.range;

  if (
    range &&
    (ext === ".mp4" || ext === ".webm" || ext === ".ogg" || ext === ".mp3")
  ) {
    const parts = range.replace(/bytes=/, "").split("-");
    const partialStart = parts[0];
    const partialEnd = parts[1];

    const start = parseInt(partialStart, 10);
    const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
    const chunksize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${total}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": contentType,
    });
    file.pipe(res);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error reading file");
      return;
    }
    console.log(`[200] ${req.url}`);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": data.length,
      "Accept-Ranges": "bytes",
    });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Lusion Reconstructed Server running at http://localhost:${PORT}/`,
  );
});
