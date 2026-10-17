import fs from "fs";

const css = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.css",
  "utf8",
);

let idx = 0;
while ((idx = css.indexOf("project-item", idx)) !== -1) {
  console.log(css.substring(idx - 20, idx + 200));
  console.log("---");
  idx += 50;
  if (idx > 100000) break;
}
