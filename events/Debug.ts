import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class DebugEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "debug");
  }

  async execute(client: AuroraClient, info: any) {
    if (client.config.debug.debug_events) {
      console.log(`[debug] ${info}`);
    }
  }
}
