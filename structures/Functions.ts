import { TimestampStylesString } from "@discordjs/builders";
import {
  Formatters,
  Interaction,
  EmbedBuilder,
  escapeMarkdown,
} from "discord.js";
import { AuroraClient } from "./AuroraClient";

export class Functions {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;
  }

  /**
   * Returns a pre-formatted embed
   * @param {Interaction} interaction Your interaction (aka slash command)
   */
  buildEmbed(interaction: Interaction) {
    if (!interaction) {
      throw Error("Expected interaction to be provided (buildEmbed)");
    }

    return new EmbedBuilder()
      .setFooter({
        text: interaction.user?.tag,
        iconURL: interaction.user?.displayAvatarURL(),
      })
      .setColor("#7289da")
      .setTimestamp();
  }

  /**
   * Returns a formatted reply
   * @param {string} replyContent Reply content you would like to format
   * @param {string} emoji Emoji you would like to add
   */
  formatReply(replyContent: string, emoji: string) {
    return `${emoji} | ${replyContent}`;
  }

  /**
   * Performs voice channel checks; useful for commands
   * @param {Interaction} interaction Your interaction (aka slash command)
   * @param {boolean} checkPlaying Whether to check queue and voice connection
   * @param {boolean} checkQueue Whether to check queue size
   */
  async checkVoice(
    interaction: any,
    checkPlaying: boolean,
    checkQueue: boolean
  ) {
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: this.formatReply(
          "You're not in a voice channel.",
          this.client.config.emojis.cross_mark
        ),
        ephemereal: true,
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.reply({
        content: this.formatReply(
          "You've deafened yourself.",
          this.client.config.emojis.cross_mark
        ),
        ephemereal: true,
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.reply({
        content: this.formatReply(
          "You're deafened server-wide.",
          this.client.config.emojis.cross_mark
        ),
        ephemereal: true,
      });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channelId !== interaction.member.voice.channelId
    ) {
      return interaction.reply({
        content: this.formatReply(
          "You're not in the same voice channel as me.",
          this.client.config.emojis.cross_mark
        ),
        ephemereal: true,
      });
    }

    if (checkPlaying) {
      const connection = await interaction.client.player.voices.get(
        interaction.guild.id
      );
      if (!connection) {
        return interaction.reply({
          content: this.formatReply(
            "There's no voice connection in this server.",
            this.client.config.emojis.cross_mark
            ), ephemeral: true,
          });
      } else if (!queue) {
        return interaction.reply({
          content: this.formatReply(
            "The queue is empty.",
            this.client.config.emojis.cross_mark
            ), ephemeral: true,
          });
      }
    }

    if (checkQueue) {
      if (!queue || queue.songs.length === 1) {
        return interaction.reply({
          content: this.formatReply(
            "The current track is the last one in the queue.\nIf you want to destroy the voice connection, use `/stop` instead.",
            this.client.config.emojis.cross_mark
            ), ephemeral: true,
          });
      }
    }

    return true;
  }

  /**
   * Checks if the command author is a bot owner
   * @param {Interaction} interaction Your interaction (aka slash command)
   */
  checkOwner(interaction: any) {
    if (!interaction.client.config.owners) {
      return interaction.reply({
        content: interaction.client.functions.formatReply(
          "Owners list is empty, please check your config file.",
          interaction.client.config.emojis.cross_mark
        ), ephemeral: true,
      });
    } else if (
      !interaction.client.config.owners.includes(interaction.user.id)
    ) {
      return interaction.reply({
        content: interaction.client.functions.formatReply(
          "You're not included in owners list.",
          interaction.client.config.emojis.cross_mark
          ), ephemeral: true,
      });
    }

    return true;
  }

  /**
   * Returns a formatted time
   * @param {number} time Your timestamp in ms
   * @param {TimestampStylesString} type
   */
  formatTime(time: number, type: TimestampStylesString) {
    return Formatters.time(parseInt(Math.floor(time / 1000).toString()), type);
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
  escapeMd(str: any) {
    return escapeMarkdown(str, {
      codeBlock: true,
      spoiler: true,
      inlineCode: true,
      inlineCodeContent: true,
      codeBlockContent: true,
    });
  }
}
