import glob from "glob";
import { AuroraClient } from "./AuroraClient";
import { Event } from "./Event";
import { resolveFile, validateFile } from "./HandlerFunctions";

export class AuroraEventManager {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;
  }

  async init() {
    const files = glob.sync("./events/*.ts");

    for (const file of files) {
      delete require.cache[file];

      const event = await resolveFile<Event>(file, this.client);
      if (!event) continue;
      await validateFile(file, event);

      if (!event.execute) {
        throw new TypeError(
          `[ERROR][events]: execute function is required for events! (${file})`
        );
      }

      if (event.player) {
        this.client.player.on(
          event.name as any,
          event.execute.bind(null, this.client)
        );
      } else if (event.once) {
        this.client.once(event.name, event.execute.bind(null, this.client));
      } else {
        this.client.on(event.name, event.execute.bind(null, this.client));
      }

      if (this.client.config.debug.handler_logs) {
        console.log(`[events] Loaded event ${event.name}`);
      }
    }
  }
}
