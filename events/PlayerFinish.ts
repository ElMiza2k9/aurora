import { Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerFinishEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "finish", false, true);
  }

  async execute(client: AuroraClient, queue: Queue) {
    const l = await client.locales.getLocale(queue.id);
    queue.textChannel?.send({
      content: client.reply(l("misc:music:finished"), ":stop_button:"),
    });
  }
}
