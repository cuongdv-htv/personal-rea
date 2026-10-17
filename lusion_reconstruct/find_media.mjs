import fs from "fs";
import path from "path";

const dir = "d:/00_CODING/rea/lusion_reconstruct";
const js = fs.readFileSync(path.join(dir, "original.js"), "utf8");

const regex =
  /["'`][^"'`\s]+\.(?:glb|gltf|bin|mp3|ogg|wav|png|jpg|jpeg|webp|hdr|exr|svg|woff2?)[^"'`\s]*["'`]/gi;
const matches = new Set();
let m;
while ((m = regex.exec(js)) !== null) {
  matches.add(m[0].slice(1, -1));
}

console.log("Found media/file matches:", matches.size);
console.log(JSON.stringify(Array.from(matches).sort(), null, 2));
