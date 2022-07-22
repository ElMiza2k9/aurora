import {
  Formatters,
  EmbedBuilder,
  escapeMarkdown,
  TimestampStylesString,
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
  buildEmbed(interaction: any) {
    if (!interaction) {
      throw Error("Expected interaction to be provided (buildEmbed)");
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
  formatReply(replyContent: string, emoji: string) {
    return `${emoji} | ${replyContent}`;
  }

  /**
   * Performs voice channel checks; useful for commands
   * @param {Interaction} interaction Your interaction (aka slash command)
   * @param {boolean} checkIfConnected Whether to check voice connection
   * @param {boolean} checkIfQueueExists Whether to check if queue exists
   * @param {boolean} checkIfLastSong Whether to check queue size
   */
  async checkVoice(
    interaction: any,
    checkIfConnected: boolean,
    checkIfQueueExists: boolean,
    checkIfLastSong: boolean
  ) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: this.formatReply(
          "You're not in a voice channel.",
          this.client.config.emojis.cross_mark
        ),
        ephemeral: true,
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.reply({
        embeds: [
          this.buildEmbed(interaction).setDescription(
            this.formatReply(
              "You've deafened yourself.",
              this.client.config.emojis.cross_mark
            )
          ),
        ],
        ephemeral: true,
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.reply({
        embeds: [
          this.buildEmbed(interaction).setDescription(
            this.formatReply(
              "You're deafened server-wide.",
              this.client.config.emojis.cross_mark
            )
          ),
        ],
        ephemeral: true,
      });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channelId !== interaction.member.voice.channelId
    ) {
      return interaction.reply({
        embeds: [
          this.buildEmbed(interaction).setDescription(
            this.formatReply(
              "You're not in the same voice channel as me.",
              this.client.config.emojis.cross_mark
            )
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
            this.buildEmbed(interaction).setDescription(
              this.formatReply(
                "There's no voice connection in this server.",
                this.client.config.emojis.cross_mark
              )
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
            this.buildEmbed(interaction).setDescription(
              this.formatReply(
                "The queue is empty.",
                this.client.config.emojis.cross_mark
              )
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
            this.buildEmbed(interaction).setDescription(
              this.formatReply(
                "The current track is the last one in the queue.\nIf you want to destroy the voice connection, use `/stop` instead.",
                this.client.config.emojis.cross_mark
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
   */
  checkOwner(interaction: any) {
    if (!interaction.client.config.owners) {
      return interaction.reply({
        embeds: [
          this.buildEmbed(interaction).setDescription(
            interaction.client.functions.formatReply(
              "Owners list is empty, please check your config file.",
              interaction.client.config.emojis.cross_mark
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
          this.buildEmbed(interaction).setDescription(
            interaction.client.functions.formatReply(
              "You're not included in owners list.",
              interaction.client.config.emojis.cross_mark
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
   * @param {number} time Your timestamp in ms
   * @param {TimestampStylesString} type
   */
  formatTime(time: number, type: TimestampStylesString) {
    return Formatters.time(Math.floor(new Date(time).getTime() / 1000), type);
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
