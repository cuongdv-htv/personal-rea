import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

const regex = /properties\.loader\.add\(([^,]+)/g;
const matches = new Set();
let m;
while ((m = regex.exec(js)) !== null) {
  matches.add(m[1].trim());
}
console.log("Loader additions count:", matches.size);
console.log(JSON.stringify(Array.from(matches).sort(), null, 2));
