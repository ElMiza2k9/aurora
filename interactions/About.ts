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
    const embed = this.client.functions
      .buildEmbed(interaction)
      .setTitle(
        `${this.client.functions.escapeMd(interaction.client.user.username)} v${
          this.client.package.version
        }`
      )
      .setThumbnail(interaction.client.user.avatarURL())
      .setDescription(
        `A self-hosted instance of [${this.client.functions.toCapitalize(
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
          value: interaction.client.users.cache.size.toString(),
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
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
          inline: true,
        }
      )
      .setFooter({
        text: `© 2022 ${
          this.client.package.author ?? "chamln"
        }. Licensed under ${this.client.package.license ?? "Apache 2.0"}.`,
      });

    interaction.reply({ embeds: [embed] });
  }
}
