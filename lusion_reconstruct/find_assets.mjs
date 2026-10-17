import fs from "fs";
import path from "path";

const dir = "d:/00_CODING/rea/lusion_reconstruct";
const html = fs.readFileSync(path.join(dir, "original.html"), "utf8");
const css = fs.readFileSync(path.join(dir, "original.css"), "utf8");
const js = fs.readFileSync(path.join(dir, "original.js"), "utf8");

const regex = /["'`(](\/assets\/[^"'`)\s]+)["'`)]/g;
const found = new Set();
let m;
while ((m = regex.exec(html)) !== null) found.add(m[1]);
while ((m = regex.exec(css)) !== null) found.add(m[1]);
while ((m = regex.exec(js)) !== null) found.add(m[1]);

console.log("Found /assets/ count:", found.size);
console.log(JSON.stringify(Array.from(found).sort(), null, 2));
