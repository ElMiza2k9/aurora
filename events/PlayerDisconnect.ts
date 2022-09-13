import { Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerDisconnectEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "disconnect", false, true);
  }

  async execute(client: AuroraClient, queue: Queue) {
    const l = await client.locales.getLocale(queue.id);
    await queue.stop();
    queue.textChannel?.send({
      content: client.reply(l("misc:music:disconnected"), ":stop_button:"),
    });
  }
}
