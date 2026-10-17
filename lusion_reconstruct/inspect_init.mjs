import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

const end = js.substring(js.length - 1200);
console.log("--- END OF original.js ---");
console.log(end);
