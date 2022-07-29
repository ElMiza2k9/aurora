import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class AboutCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "about",
      description: "Get the info about the bot",
    });
  }
  async execute(interaction) {
    const baseURL =
      interaction.client.package.homepage ?? "https://github.com?chamln/aurora";

    interaction.reply({
      content: interaction.client.functions.formatReply(
        `Here's some info about me:`,
        interaction.client.config.emojis.check_mark
      ),
      embeds: [
        this.client.functions
          .buildEmbed(interaction)
          .setThumbnail(interaction.client.user.avatarURL())
          .setDescription(
            `${this.client.functions.escapeMd(
              interaction.client.user.username
            )} v${
              this.client.package.version
            } is a self-hosted instance of [${this.client.functions.toCapitalize(
              this.client.package.name
            )}](${this.client.package.homepage}).`
          )
          .addFields(
            {
              name: "Servers",
              value: interaction.client.guilds.cache.size.toString(),
              inline: true,
            },
            {
              name: "Channels",
              value: interaction.client.channels.cache.size.toString(),
              inline: true,
            },
            {
              name: "Users",
              value: interaction.client.guilds.cache
                .reduce((a, g) => a + g.memberCount, 0)
                .toString(),
              inline: true,
            },
            {
              name: "Ping",
              value: `${interaction.client.ws.ping} ms`,
              inline: true,
            },
            {
              name: "RAM (heap)",
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )} MB`,
              inline: true,
            },
            {
              name: "RAM (all)",
              value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(
                2
              )} MB`,
              inline: true,
            }
          )
          .setFooter({
            text: `© 2022 ${
              this.client.package.author ?? "chamln"
            }. Licensed under ${this.client.package.license ?? "Apache 2.0"}.`,
          }),
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("Source code")
            .setStyle(ButtonStyle.Link)
            .setURL(baseURL),
          new ButtonBuilder()
            .setLabel("Report issues/suggest features")
            .setStyle(ButtonStyle.Link)
            .setURL(`${baseURL}/discussions`),
          new ButtonBuilder()
            .setLabel("Discord server")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/ctKs8WRQR5"),
        ]),
      ],
    });
  }
}
