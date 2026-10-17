import https from "https";
import fs from "fs";
import path from "path";

const baseDir = "d:/00_CODING/rea/lusion_reconstruct";

const assetList = [
  // Fonts
  "assets/fonts/Aeonik-Regular.woff2",
  "assets/fonts/Aeonik-Regular.woff",
  "assets/fonts/Aeonik-Medium.woff2",
  "assets/fonts/Aeonik-Medium.woff",
  "assets/fonts/Aeonik-RegularItalic.woff2",
  "assets/fonts/Aeonik-RegularItalic.woff",
  "assets/fonts/IBMPlexMono-Regular.woff2",
  "assets/fonts/IBMPlexMono-Regular.woff",
  "assets/fonts/IBMPlexMono-Medium.woff2",
  "assets/fonts/IBMPlexMono-Medium.woff",
  "assets/fonts/LusionMono.woff2",
  "assets/fonts/LusionMono.woff",

  // CSS Images & Icons
  "assets/images/icons/arrow-right.svg",
  "assets/images/icons/arrow-down.svg",
  "assets/images/cards/back.png",

  // Models
  "assets/models/home/cross.buf",
  "assets/models/home/cross_ld.buf",
  "assets/models/lines/line_reel.buf",
  "assets/models/lines/line_goal.buf",
  "assets/models/lines/line_capability.buf",
  "assets/models/lines/line_office.buf",
  "assets/models/plant.buf",

  // Textures
  "assets/textures/home/matcap.exr",
  "assets/textures/home/matcap_ld.exr",
  "assets/textures/font.png",
  "assets/textures/flip_texture.png",
  "assets/textures/LDR_RGB1_0.png",
  "assets/textures/award_gradient.png",
  "assets/textures/smaa-area.png",
  "assets/textures/smaa-search.png",

  // Audios
  "assets/audios/hover_0.ogg",
  "assets/audios/hover_1.ogg",
  "assets/audios/hover_2.ogg",
  "assets/audios/click_0.ogg",
  "assets/audios/click_1.ogg",
  "assets/audios/focus_0.ogg",
  "assets/audios/focus_1.ogg",
  "assets/audios/focus_2.ogg",
  "assets/audios/glass_broken.ogg",
  "assets/audios/page_0.ogg",
  "assets/audios/page_1.ogg",
  "assets/audios/generic.ogg",

  // Favicons / Meta
  "assets/meta/favicon-32x32.png",
  "assets/meta/favicon-16x16.png",
  "assets/meta/favicon.ico",
  "assets/meta/apple-touch-icon.png",
];

// Add projects home.webp and home_depth.webp
const projects = [
  "oryzo_ai",
  "atlas_motion",
  "devin_ai",
  "of_the_oak",
  "everswap",
  "porsche_dream_machine",
  "synthetic_human",
  "spatial_fusion",
  "spaace",
  "ddd_2024",
  "choo_choo_world",
  "soda_experience",
];

for (const p of projects) {
  assetList.push(`assets/projects/${p}/home.webp`);
  assetList.push(`assets/projects/${p}/home_depth.webp`);
}

function download(assetPath) {
  return new Promise((resolve) => {
    const targetFile = path.join(baseDir, assetPath);
    if (fs.existsSync(targetFile)) {
      return resolve({ path: assetPath, status: "exists" });
    }
    const dir = path.dirname(targetFile);
    fs.mkdirSync(dir, { recursive: true });

    const url = `https://lusion.dev/${assetPath}`;
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        // Try fallback to lusion.co
        const fallbackUrl = `https://lusion.co/${assetPath}`;
        https
          .get(fallbackUrl, (fbRes) => {
            if (fbRes.statusCode !== 200) {
              console.log(`Failed (${fbRes.statusCode}): ${assetPath}`);
              return resolve({ path: assetPath, status: "failed" });
            }
            const chunks = [];
            fbRes.on("data", (c) => chunks.push(c));
            fbRes.on("end", () => {
              fs.writeFileSync(targetFile, Buffer.concat(chunks));
              console.log(`Downloaded (fallback): ${assetPath}`);
              resolve({ path: assetPath, status: "downloaded" });
            });
          })
          .on("error", () => resolve({ path: assetPath, status: "failed" }));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        fs.writeFileSync(targetFile, Buffer.concat(chunks));
        console.log(`Downloaded: ${assetPath}`);
        resolve({ path: assetPath, status: "downloaded" });
      });
    });
    req.on("error", (err) => {
      console.log(`Error on ${assetPath}:`, err.message);
      resolve({ path: assetPath, status: "error" });
    });
  });
}

async function run() {
  console.log(`Starting download of ${assetList.length} assets...`);
  // Download in chunks of 5
  for (let i = 0; i < assetList.length; i += 5) {
    const chunk = assetList.slice(i, i + 5);
    await Promise.all(chunk.map(download));
  }
  console.log("Finished downloading all assets!");
}

run();
