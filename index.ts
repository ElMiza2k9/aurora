import P from "bluebird";
import "dotenv/config";

P.Promise.config({
  longStackTraces: true,
});

import { AuroraClient } from "./structures/AuroraClient";
const client = new AuroraClient();
client.init();

if (client.config.debug.debug_events) {
  process.on("unhandledRejection", (error) =>
    console.error(`[error] ${error}`)
  );
}
