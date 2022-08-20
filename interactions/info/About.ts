import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class AboutCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "about",
      topName: "info",
      description: "Get the info about the bot",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const baseURL =
      this.client.package.homepage ?? "https://github.com/chamln/aurora";

    await interaction.followUp({
      content: this.client.functions.reply(
        l("commands:info:about:reply"),
        ":white_check_mark:"
      ),
      embeds: [
        this.client.functions
          .embed(interaction)
          .setThumbnail(this.client.user.avatarURL())
          .addFields(
            {
              name: l("commands:info:about:fields:version"),
              value: `v${this.client.package.version}`,
              inline: true,
            },
            {
              name: l("commands:info:about:fields:channels"),
              value: this.client.channels.cache.size.toString(),
              inline: true,
            },
            {
              name: l("commands:info:about:fields:users"),
              value: this.client.guilds.cache
                .reduce((a, g) => a + g.memberCount, 0)
                .toString(),
              inline: true,
            },
            {
              name: l("commands:info:about:fields:latency:name"),
              value: l("commands:info:about:fields:latency:value", {
                latency: `${this.client.ws.ping}`,
              }),
              inline: true,
            },
            {
              name: l("commands:info:about:fields:ram_heap:name"),
              value: l("commands:info:about:fields:ram_heap:value", {
                mem: `${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}`,
              }),
              inline: true,
            },
            {
              name: l("commands:info:about:fields:ram_all:name"),
              value: l("commands:info:about:fields:ram_all:value", {
                mem: `${(process.memoryUsage().rss / 1048576).toFixed(2)}`,
              }),
              inline: true,
            }
          )
          .setFooter({
            text: l("commands:info:about:footer", {
              author: `${this.client.package.author ?? "chamln"}`,
              license: `${this.client.package.license ?? "Apache 2.0"}`,
            }),
          }),
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel(l("commands:info:about:buttons:0"))
            .setStyle(ButtonStyle.Link)
            .setURL(baseURL),
          new ButtonBuilder()
            .setLabel(l("commands:info:about:buttons:1"))
            .setStyle(ButtonStyle.Link)
            .setURL(`${baseURL}/issues`),
          new ButtonBuilder()
            .setLabel(l("commands:info:about:buttons:2"))
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/ctKs8WRQR5"),
        ]),
      ],
    });
  }
}
