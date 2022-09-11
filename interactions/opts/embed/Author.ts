import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../../structures/AuroraClient";
import { SubCommand } from "../../../structures/SubCommand";

export default class OptsEmbedAuthorCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "author",
      groupName: "embed",
      topName: "opts",
      description: "Edit server embed settings",
      options: [
        {
          name: "state",
          type: ApplicationCommandOptionType.Boolean,
          description: "Whether to show command author in embeds",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const state = interaction.options.getBoolean("state");

    await this.client.updateGuild(interaction.guild.id, {
      embed: { show_author: state },
    });

    await interaction.followUp({
      content: this.client.reply(
        l(`commands:opts:embed:author:${state}`),
        ":bust_in_silhouette:"
      ),
    });
  }
}
