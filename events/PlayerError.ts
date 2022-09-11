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
    const l = await client.locales.getLocale(channel.guild.id);
    channel.send({
      content: client.reply(l("misc:error", { error: `${error.name}` }), ":x:"),
    });
    console.log(`[error] ${error?.stack}`);
  }
}
