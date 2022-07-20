import { TextChannel } from "discord.js";
import { DisTubeError } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerErrorEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "error", false, true);
  }

  async execute(
    client: AuroraClient,
    channel: TextChannel,
    error: DisTubeError<string>
  ) {
    channel.send({
      content: client.functions.formatReply(
        `An unknown ${error.name} happened during playback. Please check the logs for details.`,
        client.config.emojis.cross_mark
      ),
    });
    console.log(`[error] ${error?.stack}`);
  }
}
