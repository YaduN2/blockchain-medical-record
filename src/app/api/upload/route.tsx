import { ThirdwebStorage } from "@thirdweb-dev/storage";
import fs from "fs";

const storage = new ThirdwebStorage();

(async () => {
  const upload = await storage.upload(fs.readFileSync("file.txt"));
  console.log("Upload URL: ", storage.resolveScheme(upload));
})();
