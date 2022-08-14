import { ApplicationCommandOptionType, escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";
import { inspect } from "node:util";

export default class EvalCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "eval",
      topName: "dev",
      description: "Evaluate something. Proceed with caution.",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "code",
          description: "The code you want to evaluate",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "ephemeral",
          description: "Whether to send the result as an ephemeral message",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    if (!this.client.config.owners) {
      return interaction.reply({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                l("functions:owner:empty_list"),
                ":x:"
              )
            ),
        ],
        ephemeral: true,
      });
    } else if (!this.client.config.owners.includes(interaction.user.id)) {
      return interaction.reply({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                l("functions:owner:not_included"),
                ":x:"
              )
            ),
        ],
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();
      let evaled = await eval(interaction.options.getString("code"));

      evaled = inspect(evaled, {
        depth: 0,
        maxArrayLength: null,
      });

      evaled = evaled
        .replaceAll(this.client.token, "CLIENT_TOKEN")
        .replaceAll(process.env["CLIENT_TOKEN"], "CLIENT_TOKEN")
        .replaceAll(process.env["DATABASE_URL"], "DATABASE_URL")
        .replaceAll(`this.client.token`, "CLIENT_TOKEN")
        .replaceAll(`process.env["CLIENT_TOKEN"]`, "CLIENT_TOKEN")
        .replaceAll(`process.env["DATABASE_URL"]`, "DATABASE_URL");

      evaled = escapeMarkdown(evaled, {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        spoiler: false,
      });

      interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                `Evaluated successfully:\n\`\`\`js\n${evaled}\`\`\``,
                ":white_check_mark:"
              )
            ),
        ],
        ephemeral: interaction.options.getBoolean("ephemeral"),
      });
    } catch (error) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                `Evaluated with error:\n\`\`\`js\n${error?.stack}\`\`\``,
                ":x:"
              )
            ),
        ],
        ephemeral: interaction.options.getBoolean("ephemeral"),
      });
    }
  }
}
