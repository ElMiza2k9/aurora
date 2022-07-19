import { Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "empty", false, true);
  }

  async execute(client: AuroraClient, queue: Queue) {
    queue.textChannel?.send({
      content: client.functions.formatReply(
        "Cleared the queue and destroyed the voice connection due to inactivity.",
        client.config.emojis.stop
      ),
    });
  }
}
