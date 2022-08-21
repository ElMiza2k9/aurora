import * as DJS from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class GuildCreateEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "guildCreate");
  }

  async execute(client: AuroraClient, guild: DJS.Guild) {
    if (!guild) return;
    await client.addGuild(guild.id);
  }
}
