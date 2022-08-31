import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../../structures/AuroraClient";
import { SubCommand } from "../../../structures/SubCommand";

export default class OptsLocaleUserCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "user",
      groupName: "locale",
      topName: "opts",
      description: "Manage your personal locale",
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

    await this.client.locales.updateUserLocale(
      interaction.user.id,
      interaction.options.getString("locale")
    );

    await interaction.followUp({
      content: this.client.reply(
        l("commands:opts:locale:user:reply", {
          locale: `${interaction.options.getString("locale")}`,
        }),
        ":globe_with_meridians:"
      ),
    });
  }
}
