import {
  EmbedBuilder,
  escapeMarkdown,
  TimestampStylesString,
} from "discord.js";
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
        text: interaction.client.config.embeds.showAuthor
          ? interaction.user?.tag
          : null,
        iconURL: interaction.client.config.embeds.showAuthor
          ? interaction.user?.displayAvatarURL()
          : null,
      })
      .setColor(
        parseInt(interaction.client.config.embeds.hexColor, 16) ?? "#7289da"
      )
      .setTimestamp(
        interaction.client.config.embeds.setTimestamp ? Date.now() : null
      );
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
   * Performs voice channel checks; useful for commands
   * @param {Interaction} interaction Your interaction (aka slash command)
   * @param {any} t Locale
   * @param {boolean} checkIfConnected Whether to check voice connection
   * @param {boolean} checkIfQueueExists Whether to check if queue exists
   * @param {boolean} checkIfLastSong Whether to check queue size
   */
  async voice(
    interaction: any,
    t: any,
    checkIfConnected: boolean,
    checkIfQueueExists: boolean,
    checkIfLastSong: boolean
  ) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            this.reply(t("functions:voice:not_in_voice"), ":x:")
          ),
        ],
        ephemeral: true,
      });
    } else if (
      interaction.guild.afkChannel &&
      interaction.member.voice.channel.id === interaction.guild.afkChannel.id
    ) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            this.reply(t("functions:voice:in_afk"), ":x:")
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            this.reply(t("functions:voice:self_deaf"), ":x:")
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            this.reply(t("functions:voice:server_deaf"), ":x:")
          ),
        ],
        ephemeral: true,
      });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channel.id !==
        interaction.member.voice.channel.id
    ) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            this.reply(t("functions:voice:not_same_channel"), ":x:")
          ),
        ],
        ephemeral: true,
      });
    }

    if (checkIfConnected) {
      const connection = await interaction.client.player.voices.get(
        interaction.guild.id
      );
      if (!connection) {
        return interaction.reply({
          embeds: [
            this.embed(interaction).setDescription(
              this.reply(t("functions:voice:no_connection"), ":x:")
            ),
          ],
          ephemeral: true,
        });
      }
    }

    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (checkIfQueueExists) {
      if (!queue) {
        return interaction.reply({
          embeds: [
            this.embed(interaction).setDescription(
              this.reply(t("functions:voice:no_queue"), ":x:")
            ),
          ],
          ephemeral: true,
        });
      }
    }

    if (checkIfLastSong) {
      if (!queue || queue.songs.length === 1) {
        return interaction.reply({
          embeds: [
            this.embed(interaction).setDescription(
              this.reply(
                t("functions:voice:last_song", { cmd: `/music stop` }),
                ":x:"
              )
            ),
          ],
          ephemeral: true,
        });
      }
    }

    return true;
  }

  /**
   * Checks if the command author is a bot owner
   * @param {Interaction} interaction Your interaction (aka slash command)
   * @param {any} t Locale
   */
  owner(interaction: any, t: any) {
    if (!interaction.client.config.owners) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            interaction.client.functions.reply(
              t("functions:owner:empty_list"),
              ":x:"
            )
          ),
        ],
        ephemeral: true,
      });
    } else if (
      !interaction.client.config.owners.includes(interaction.user.id)
    ) {
      return interaction.reply({
        embeds: [
          this.embed(interaction).setDescription(
            interaction.client.functions.reply(
              t("functions:owner:not_included"),
              ":x:"
            )
          ),
        ],
        ephemeral: true,
      });
    }

    return true;
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

  /**
   * Formats a given string so that the first letter is capital
   * @param {string} str String to format
   */
  toCapitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Formats a given string to escape any markdown symbols
   * @param {any} str String to format
   */
  md(str: any) {
    return escapeMarkdown(str, {
      codeBlock: true,
      spoiler: true,
      inlineCode: true,
      inlineCodeContent: true,
      codeBlockContent: true,
    });
  }

  async addUser(userId: string, guild_id: string | undefined, data?: any) {
    if (!guild_id) return null;

    try {
      const user = await this.client.db.user.create({
        data: {
          user_id: userId,
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
    userId: string,
    guild_id: string | undefined,
    data: Partial<Prisma.UserUpdateManyArgs["data"]>
  ) {
    try {
      const user = await this.getUser(userId, guild_id);

      if (!user) {
        this.addUser(userId, guild_id, data);
        return;
      }

      await this.client.db.user.updateMany({
        where: { user_id: userId, guild_id: guild_id },
        data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async removeUser(userId: string, guild_id: string) {
    try {
      await this.client.db.user.deleteMany({
        where: { user_id: userId, guild_id: guild_id },
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

  async getUser(userId: string, guild_id: string | undefined) {
    if (!guild_id) return null;

    try {
      const user =
        (await this.client.db.user.findFirst({
          where: { user_id: userId, guild_id: guild_id },
        })) ?? (await this.addUser(userId, guild_id));

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
