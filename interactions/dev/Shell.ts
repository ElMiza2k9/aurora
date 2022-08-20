import { ApplicationCommandOptionType, escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ShellCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "shell",
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
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:owner:empty_list"), ":x:")
            ),
        ],
      });
    } else if (!this.client.config.owners.includes(interaction.user.id)) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:owner:not_included"), ":x:")
            ),
        ],
      });
    }

    const code = interaction.options.getString("code");

    try {
      let evaled = await require("child_process")
        .execSync(code)
        .toString("utf8")
        .split(2000);

      evaled = evaled
        .toString()
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
        content: this.client.functions.reply(
          l("commands:dev:shell:reply"),
          ":white_check_mark:"
        ),
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              `\`\`\`sh\n${evaled != "" ? evaled : "No response"}\`\`\``
            ),
        ],
      });
    } catch (error) {
      return interaction.followUp({
        content: this.client.functions.reply(
          l("commands:dev:shell:error"),
          ":white_check_mark:"
        ),
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                `\`\`\`sh\n${error?.stack}\`\`\``,
                ":x:"
              )
            ),
        ],
      });
    }
  }
}
