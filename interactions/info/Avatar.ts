import { ApplicationCommandOptionType } from "discord.js";
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
        {
          type: ApplicationCommandOptionType.String,
          name: "extension",
          description: "Avatar extension (default: PNG)",
          required: false,
          choices: [
            { name: "JPG", value: "jpg" },
            { name: "PNG", value: "png" },
            { name: "WebP", value: "webp" },
            { name: "JPEG", value: "jpeg" },
          ],
        },
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "static",
          description:
            "Whether to return static image (even if the avatar is animated) (default: no)",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    const user = interaction.options.getUser("user") ?? interaction.user;
    const size = interaction.options.getInteger("size") ?? 512;
    const extension = interaction.options.getString("format") ?? "png";
    const forceStatic = interaction.options.getBoolean("static") ?? false;
    const avatar = user.displayAvatarURL({
      extension: extension,
      size: size,
      forceStatic: forceStatic,
    });

    interaction.reply({
      embeds: [
        interaction.client.functions
          .embed(interaction)
          .setDescription(
            interaction.client.functions.reply(
              `${interaction.client.functions.escapeMd(
                user.username
              )}'s avatar:`,
              ":white_check_mark:"
            )
          )
          .setImage(avatar),
      ],
    });
  }
}
