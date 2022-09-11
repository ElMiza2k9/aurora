import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class OptsLocaleCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "locale",
      topName: "opts",
      description: "Manage this server's locale",
      user_perms: [PermissionFlagsBits.ManageGuild],
      options: [
        {
          name: "locale",
          type: ApplicationCommandOptionType.String,
          description: "The locale you want to use",
          required: true,
          choices: [
            { name: "English", value: "en-US" },
            { name: "Русский", value: "ru-RU" },
          ],
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();

    await this.client.locales.updateLocale(
      interaction.guild.id,
      interaction.options.getString("locale")
    );

    await interaction.followUp({
      content: this.client.reply(
        l("commands:opts:locale:server:reply", {
          locale: `${interaction.options.getString("locale")}`,
        }),
        ":globe_with_meridians:"
      ),
    });
  }
}
