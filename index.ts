import P from "bluebird";

P.Promise.config({
  longStackTraces: true,
});

import { AuroraClient } from "./structures/AuroraClient";
const client = new AuroraClient();
client.login(client.config.token);

if (client.config.debug.debug_events) {
  process.on("unhandledRejection", (error) =>
    console.error(`[error] ${error}`)
  );
  process.on("uncaughtExceptionMonitor", (error) =>
    console.error(`[uncaught exception] ${error}`)
  );
  process.on("warning", (warning) => console.warn(`[warning] ${warning}`));
}
