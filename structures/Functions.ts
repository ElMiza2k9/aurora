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
   * @param {Interaction} interaction
   * @returns {MessageEmbed}
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
   * Returns a formatted time
   * @param {number} time
   * @param {TimestampStylesString} type
   * @returns {number}
   */
  formatTime(time: number, type: TimestampStylesString) {
    return Formatters.time(parseInt(Math.floor(time / 1000).toString()), type);
  }

  /**
   * Formats a given string so that the first letter is capital
   * @param {string} str
   * @returns {string}
   */
  toCapitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Formats a given string to escape any markdown symbols
   * @param {any} str
   * @returns {string}
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
