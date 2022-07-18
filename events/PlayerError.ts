import { TextChannel } from "discord.js";
import { DisTubeError } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerErrorEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "error", false, true);
  }

  async execute(
    _client: AuroraClient,
    channel: TextChannel,
    error: DisTubeError<string>
  ) {
    channel.send({
      content: `An unknown ${error.name} error happened during playback. Please check the logs for details.`,
    });
    console.log(`[error] ${error?.stack}`);
  }
}
