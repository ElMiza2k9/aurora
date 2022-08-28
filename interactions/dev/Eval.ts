import { ApplicationCommandOptionType, escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";
import { inspect } from "node:util";

export default class DevEvalCommand extends SubCommand {
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
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    if (!this.client.config.owners) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:owner:empty_list"), ":x:")
            ),
        ],
      });
    } else if (!this.client.config.owners.includes(interaction.user.id)) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:owner:not_included"), ":x:")
            ),
        ],
      });
    }

    try {
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

      await interaction.followUp({
        content: this.client.reply(
          l("commands:dev:eval:reply"),
          ":white_check_mark:"
        ),
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(`\`\`\`js\n${evaled}\`\`\``),
        ],
      });
    } catch (error) {
      return interaction.followUp({
        content: this.client.reply(l("commands:dev:eval:error"), ":x:"),
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(`\`\`\`js\n${error?.stack}\`\`\``),
        ],
      });
    }
  }
}
