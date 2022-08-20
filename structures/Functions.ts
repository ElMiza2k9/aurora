import { EmbedBuilder, TimestampStylesString } from "discord.js";
import { AuroraClient } from "./AuroraClient";
import { Prisma } from "@prisma/client";

export class Functions {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;
  }

  /**
   * Returns a pre-formatted embed
   * @param {Interaction} interaction Your interaction (aka slash command)
   */
  embed(interaction: any) {
    if (!interaction) {
      throw Error("Expected interaction to be provided (embed)");
    }

    return new EmbedBuilder()
      .setFooter({
        text: this.client.config.embeds.showAuthor
          ? interaction.user?.tag
          : null,
        iconURL: this.client.config.embeds.showAuthor
          ? interaction.user?.displayAvatarURL()
          : null,
      })
      .setColor(parseInt(this.client.config.embeds.hexColor, 16) ?? "#7289da")
      .setTimestamp(this.client.config.embeds.setTimestamp ? Date.now() : null);
  }

  /**
   * Returns a formatted reply
   * @param {string} replyContent Reply content you would like to format
   * @param {string} emoji Emoji you would like to add
   */
  reply(replyContent: string, emoji: string) {
    return `${emoji} | ${replyContent}`;
  }

  /**
   * Returns a formatted time
   * @param { string | number | Date } timestamp Your timestamp
   * @param {TimestampStylesString} type Formatting type
   */
  formatTime(timestamp: string | number | Date, type: TimestampStylesString) {
    const parsed = new Date(timestamp).getTime() / 1000;
    if (!timestamp) {
      throw Error("time isn't provided (formatTime)");
    } else if (!parsed) {
      throw Error("time isn't parsable (formatTime)");
    }

    return `<t:${parseInt(parsed.toString())}:${type ?? "F"}>`;
  }

  async addUser(user_id: string, guild_id: string | undefined, data?: any) {
    if (!guild_id) return null;

    try {
      const user = await this.client.db.user.create({
        data: {
          user_id: user_id,
          guild_id: guild_id,
          ...data,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser(
    user_id: string,
    guild_id: string | undefined,
    data: Partial<Prisma.UserUpdateManyArgs["data"]>
  ) {
    try {
      const user = await this.getUser(user_id, guild_id);

      if (!user) {
        this.addUser(user_id, guild_id, data);
        return;
      }

      await this.client.db.user.updateMany({
        where: { user_id: user_id, guild_id: guild_id },
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async removeUser(user_id: string, guild_id: string) {
    try {
      await this.client.db.user.deleteMany({
        where: { user_id: user_id, guild_id: guild_id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getGuild(guild_id: string | undefined | null) {
    if (!guild_id) return null;

    try {
      const guild =
        (await this.client.db.guild.findFirst({
          where: { guild_id: guild_id },
        })) ?? (await this.addGuild(guild_id));

      return guild;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(user_id: string, guild_id: string | undefined) {
    if (!guild_id) return null;

    try {
      const user =
        (await this.client.db.user.findFirst({
          where: { user_id: user_id, guild_id: guild_id },
        })) ?? (await this.addUser(user_id, guild_id));

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async addGuild(guild_id: string | undefined) {
    if (!guild_id) return null;

    try {
      const guild = await this.client.db.guild.create({
        data: {
          guild_id: guild_id,
        },
      });

      return guild;
    } catch (error) {
      console.log(error);
    }
  }

  async updateGuild(
    guild_id: string | undefined,
    data: Partial<Prisma.GuildUpdateInput>
  ) {
    if (!guild_id) return;

    try {
      const guild = await this.getGuild(guild_id);

      if (!guild) {
        await this.addGuild(guild_id);
      }

      await this.client.db.guild.updateMany({
        where: { guild_id: guild_id },
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteGuild(guild_id: string): Promise<void> {
    try {
      await this.client.db.guild.deleteMany({ where: { guild_id: guild_id } });
    } catch (error) {
      console.log(error);
    }
  }
}
