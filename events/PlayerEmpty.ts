import { Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "empty", false, true);
  }

  async execute(client: AuroraClient, queue: Queue) {
    const l = await client.locales.getLocale(
      queue.id,
      queue!.songs[0].user!.id
    );
    queue.textChannel?.send({
      content: client.reply(l("misc:music:stopped"), ":pensive:"),
    });
  }
}
