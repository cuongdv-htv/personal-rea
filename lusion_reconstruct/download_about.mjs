import https from "https";
import fs from "fs";
import path from "path";

const baseDir = "d:/00_CODING/rea/lusion_reconstruct";

const moreAssets = [
  "assets/models/about/bg_box.buf",
  "assets/models/about/camera_spline.buf",
  "assets/models/about/letter_placements.buf",
  "assets/models/about/logo_text.buf",
  "assets/models/about/person.buf",
  "assets/models/about/person_idle.buf",
  "assets/models/about/terrain.buf",
  "assets/models/about/terrain_lines.buf",
  "assets/textures/about/fog.png",
  "assets/textures/about/rocks.webp",
  "assets/textures/about/ground_person_shadow.webp",
  "assets/textures/about/person.webp",
  "assets/textures/about/person_light.webp",
  "assets/textures/about/terrain_shadow_light_height.webp",
];

function download(assetPath) {
  return new Promise((resolve) => {
    const targetFile = path.join(baseDir, assetPath);
    if (fs.existsSync(targetFile)) return resolve(true);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });

    https
      .get(`https://lusion.dev/${assetPath}`, (res) => {
        if (res.statusCode !== 200) {
          console.log(`Failed (${res.statusCode}): ${assetPath}`);
          return resolve(false);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          fs.writeFileSync(targetFile, Buffer.concat(chunks));
          console.log(`Downloaded: ${assetPath}`);
          resolve(true);
        });
      })
      .on("error", () => resolve(false));
  });
}

async function run() {
  for (const a of moreAssets) {
    await download(a);
  }
  console.log("Finished about assets download!");
}

run();
