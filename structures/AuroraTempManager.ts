import { AuroraClient } from "./AuroraClient";
import TempChannelsManager from "discord-temp-channels";
import { Snowflake } from "discord.js";

export interface TempVoiceData {
  guild_id: Snowflake;
  channel_id: Snowflake;
  options: {
    category_id: Snowflake;
    delete_if_empty?: boolean;
    delete_if_no_owner?: boolean;
    member_limit?: number;
    bitrate?: number;
    format?: string;
  };
}

export class AuroraTempManager extends TempChannelsManager {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    super(client);
    this.client = client;
  }

  async init() {
    const tempvoices = await this.client.db.tempVoice.findMany();

    tempvoices.forEach((t) => {
      if (!this.client.channels.cache.get(t.channel_id)) return;
      this.registerChannel(t.channel_id, {
        childCategory: t.category_id,
        childAutoDeleteIfEmpty: t.delete_if_empty,
        childAutoDeleteIfOwnerLeaves: t.delete_if_no_owner,
        childMaxUsers: t.member_limit,
        childBitrate: t.bitrate,
        childFormat: (member, count) => `#${count} [${member.user.username}]`,
      });
    });

    console.log(`[tempvoices] Registered ${tempvoices.length} tempvoices`);
  }

  async create(data: TempVoiceData) {
    await this.client.tempvoices.registerChannel(data.channel_id, {
      childCategory: data.options.category_id,
      childAutoDeleteIfEmpty: data.options.delete_if_empty ?? true,
      childAutoDeleteIfOwnerLeaves: data.options.delete_if_no_owner ?? true,
      childMaxUsers: data.options.member_limit ?? 4,
      childBitrate: data.options.bitrate ?? 64000,
      childFormat: (member, count) =>
        data.options.format ?? `#${count} [${member.user.username}]`,
    });

    await this.client.db.tempVoice.create({
      data: {
        guild_id: data.guild_id,
        channel_id: data.channel_id,
        category_id: data.options.category_id,
        delete_if_empty: data.options.delete_if_empty ?? true,
        delete_if_no_owner: data.options.delete_if_no_owner ?? true,
        member_limit: data.options.member_limit ?? 4,
        bitrate: data.options.bitrate ?? 64000,
      },
    });
  }

  async find(channel_id: Snowflake) {
    return this.client.db.tempVoice.findMany({
      where: { channel_id: channel_id },
    });
  }

  async delete(channel_id: Snowflake) {
    await this.client.tempvoices.unregisterChannel(channel_id);
    await this.client.db.tempVoice.deleteMany({
      where: { channel_id: channel_id },
    });
  }
}
