import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

const regex =
  /(?:MODEL_PATH|TEXTURE_PATH|IMAGE_PATH|SPRITE_PATH|AUDIO_PATH|PROJECT_PATH)\s*\+\s*['"`]([^'"`]+)['"`]/g;
const matches = new Set();
let m;
while ((m = regex.exec(js)) !== null) {
  matches.add(m[0]);
}
console.log("Path additions count:", matches.size);
console.log(JSON.stringify(Array.from(matches).sort(), null, 2));
