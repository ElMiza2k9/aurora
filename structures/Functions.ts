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
    return `${emoji} | ${replyContent}`
   };

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
