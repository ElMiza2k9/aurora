import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../../structures/AuroraClient";
import { SubCommand } from "../../../structures/SubCommand";

export default class OptsGeneralColorCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "color",
      groupName: "general",
      topName: "opts",
      description: "Edit server embed color",
      options: [
        {
          name: "color",
          type: ApplicationCommandOptionType.String,
          description: "The color you want to set (HEX, # allowed)",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const color = interaction.options.getString("color");

    if (!/^#?([0-9a-f]{6})$/i.test(color)) {
      return interaction.followUp({
        content: this.client.reply(
          l("commands:opts:general:color:invalid_color"),
          ":x:"
        ),
      });
    }

    await this.client.updateGuild(interaction.guild.id, {
      settings: { general: { embed_color: color.replace("#", "") } },
    });

    await interaction.followUp({
      content: this.client.reply(
        l("commands:opts:embed:color:reply", {
          color: `${color.replace("#", "")}`,
        }),
        ":art:"
      ),
    });
  }
}
