import { Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "empty", false, true);
  }

  async execute(client: AuroraClient, queue: Queue, l) {
    queue.textChannel?.send({
      content: client.reply(l("misc:music:stopped"), ":pensive:"),
    });
  }
}
