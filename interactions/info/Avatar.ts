import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  escapeMarkdown,
} from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class AvatarCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "avatar",
      topName: "info",
      description: "Shows your (or someone else's) avatar.",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "The user whose avatar you want to get (default: you)",
          required: false,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "size",
          description: "Avatar size (default: 512)",
          required: false,
          choices: [
            { name: "16px", value: 16 },
            { name: "32px", value: 32 },
            { name: "64px", value: 64 },
            { name: "128px", value: 128 },
            { name: "256px", value: 256 },
            { name: "512px", value: 512 },
            { name: "1024px", value: 1024 },
            { name: "2048px", value: 2048 },
            { name: "4096px", value: 4096 },
          ],
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user") ?? interaction.user;
    const size = interaction.options.getInteger("size") ?? 512;
    const avatar = user.displayAvatarURL({
      size: size,
    });

    await interaction.followUp({
      content: this.client.reply(
        l("commands:info:avatar:reply", {
          user: `**${escapeMarkdown(user.tag)}**`,
        }),
        ":frame_photo:"
      ),
      embeds: [this.client.embed(interaction).setImage(avatar)],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel("PNG")
            .setStyle(ButtonStyle.Link)
            .setURL(
              user.displayAvatarURL({
                size: size,
                extension: "png",
              })
            ),
          new ButtonBuilder()
            .setLabel("JPG")
            .setStyle(ButtonStyle.Link)
            .setURL(
              user.displayAvatarURL({
                size: size,
                extension: "jpg",
              })
            ),
          new ButtonBuilder()
            .setLabel("WebP")
            .setStyle(ButtonStyle.Link)
            .setURL(
              user.displayAvatarURL({
                size: size,
                extension: "webp",
              })
            ),
        ]),
      ],
    });
  }
}
