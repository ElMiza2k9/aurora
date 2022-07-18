import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class WarnEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "warn");
  }

  async execute(client: AuroraClient, info: any) {
    if (client.config.debug.debug_events) {
      console.log(`[warn] ${info}`);
    }
  }
}
