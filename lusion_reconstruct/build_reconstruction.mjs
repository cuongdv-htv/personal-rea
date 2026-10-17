import fs from "fs";
import path from "path";

const baseDir = "d:/00_CODING/rea/lusion_reconstruct";

// 1. Process HTML
let html = fs.readFileSync(path.join(baseDir, "original.html"), "utf8");

// Replace CSS and JS bundle links
html = html.replace("/_astro/about.CNa9RfUh.css", "./style.css");
html = html.replace("/_astro/hoisted.CUO_IjfL.js", "./main.js");

// Replace <base href="/"> with <base href="./"> so it works at any subpath or root
html = html.replace('<base href="/">', '<base href="./">');

// Update asset links in HTML
html = html.replace(/href="\.\/assets\//g, 'href="./assets/');

fs.writeFileSync(path.join(baseDir, "index.html"), html);
console.log("index.html written successfully! Length:", html.length);

// 2. Process CSS
let css = fs.readFileSync(path.join(baseDir, "original.css"), "utf8");

// Replace font and asset urls with ./assets/
css = css.replace(/url\(\/assets\//g, "url(./assets/");

fs.writeFileSync(path.join(baseDir, "style.css"), css);
console.log("style.css written successfully! Length:", css.length);

// 3. Process JS
let js = fs.readFileSync(path.join(baseDir, "original.js"), "utf8");

// In JS, let's check Settings paths
// Settings has:
// TEAM_PATH="/assets/team/";PROJECT_PATH="/assets/projects/";MODEL_PATH="/assets/models/";IMAGE_PATH="/assets/images/";TEXTURE_PATH="/assets/textures/";AUDIO_PATH="/assets/audios/";SPRITE_PATH="/assets/sprites/";
// We change /assets/ to ./assets/ so it works whether served from root or subfolder
js = js.replace(/TEAM_PATH="\/assets\/team\/"/g, 'TEAM_PATH="./assets/team/"');
js = js.replace(
  /PROJECT_PATH="\/assets\/projects\/"/g,
  'PROJECT_PATH="./assets/projects/"',
);
js = js.replace(
  /MODEL_PATH="\/assets\/models\/"/g,
  'MODEL_PATH="./assets/models/"',
);
js = js.replace(
  /IMAGE_PATH="\/assets\/images\/"/g,
  'IMAGE_PATH="./assets/images/"',
);
js = js.replace(
  /TEXTURE_PATH="\/assets\/textures\/"/g,
  'TEXTURE_PATH="./assets/textures/"',
);
js = js.replace(
  /AUDIO_PATH="\/assets\/audios\/"/g,
  'AUDIO_PATH="./assets/audios/"',
);
js = js.replace(
  /SPRITE_PATH="\/assets\/sprites\/"/g,
  'SPRITE_PATH="./assets/sprites/"',
);

// Also check font loader in js:
// If FontItem loads from /assets/fonts, let's see how FontItem is implemented
fs.writeFileSync(path.join(baseDir, "main.js"), js);
console.log("main.js written successfully! Length:", js.length);
