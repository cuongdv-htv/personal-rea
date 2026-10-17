import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

for (const pattern of ["home/", "lines/"]) {
  let idx = 0;
  while ((idx = js.indexOf(pattern, idx)) !== -1) {
    if (idx > -1) {
      console.log("===", pattern, "at", idx, "===");
      console.log(
        js.substring(Math.max(0, idx - 100), Math.min(js.length, idx + 200)),
      );
    }
    idx += pattern.length + 10;
    if (idx > 1000000) break;
  }
}
