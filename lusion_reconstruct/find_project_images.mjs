import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

const idx = js.indexOf("project-item-image");
if (idx > -1) {
  console.log(js.substring(idx - 200, idx + 400));
} else {
  console.log("Not found");
}
