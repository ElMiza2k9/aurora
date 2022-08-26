import * as DJS from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class GuildDeleteEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "guildDelete");
  }

  async execute(client: AuroraClient, guild: DJS.Guild) {
    if (!guild) return;
    await client.deleteGuild(guild.id);
  }
}
