import fs from "fs";
import path from "path";

const src = "d:/00_CODING/rea/lusion_reconstruct";
const dist = path.join(src, "dist");

console.log("Preparing production bundle in dist/...");
if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

// Copy core web files
for (const file of ["index.html", "style.css", "main.js"]) {
  fs.copyFileSync(path.join(src, file), path.join(dist, file));
  console.log(`✓ Copied ${file}`);
}

// Copy assets recursively
function copyDir(s, d) {
  fs.mkdirSync(d, { recursive: true });
  for (const item of fs.readdirSync(s)) {
    const sPath = path.join(s, item);
    const dPath = path.join(d, item);
    if (fs.statSync(sPath).isDirectory()) {
      copyDir(sPath, dPath);
    } else {
      fs.copyFileSync(sPath, dPath);
    }
  }
}

copyDir(path.join(src, "assets"), path.join(dist, "assets"));
console.log(
  "✓ All 3D models, textures, fonts, and project assets copied to dist/assets/",
);
console.log("Production build ready for Cloudflare Pages!");
