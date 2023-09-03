import { processDatabase } from "kanel";
import config from "./.kanelrc";

async function run() {
  try {
    console.log("Building db types with config: ", config);
    await processDatabase(config);
  } catch (error) {
    console.log("Failed to build types", error);
  }
}

run();
