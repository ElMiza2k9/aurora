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
   */
  async checkVoice(interaction: any, checkPlaying: boolean) {
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
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const connection = await interaction.client.player.voices.get(
        interaction.guild.id
      );
      if (!queue && !connection) {
        return interaction.reply({
          content: this.formatReply(
            "There's no queue and/or voice connection in this server.",
            this.client.config.emojis.cross_mark
          ),
        });
      }
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
