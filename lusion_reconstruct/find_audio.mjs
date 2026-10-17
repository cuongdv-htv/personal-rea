import fs from "fs";

const js = fs.readFileSync(
  "d:/00_CODING/rea/lusion_reconstruct/original.js",
  "utf8",
);

let idx = 0;
while ((idx = js.indexOf("AUDIO_PATH", idx)) !== -1) {
  console.log(js.substring(idx - 50, idx + 200));
  console.log("---");
  idx += 20;
}
