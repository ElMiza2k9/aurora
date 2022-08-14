import { ApplicationCommandOptionType } from "discord.js";
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
    const isOwner = interaction.client.functions.owner(interaction, l);
    const code = interaction.options.getString("code");
    const isEphemeral = interaction.options.getBoolean("ephemeral");

    if (isOwner === true) {
      try {
        await interaction.deferReply();
        let evaled = await eval(code);

        evaled = inspect(evaled, {
          depth: 0,
          maxArrayLength: null,
        });

        evaled = evaled
          .replaceAll(interaction.client.token, "CLIENT_TOKEN")
          .replaceAll(process.env["CLIENT_TOKEN"], "CLIENT_TOKEN")
          .replaceAll(process.env["DATABASE_URL"], "DATABASE_URL")
          .replaceAll(`interaction.client.token`, "CLIENT_TOKEN")
          .replaceAll(`process.env["CLIENT_TOKEN"]`, "CLIENT_TOKEN")
          .replaceAll(`process.env["DATABASE_URL"]`, "DATABASE_URL");

        evaled = interaction.client.functions.md(evaled);

        interaction.followUp({
          embeds: [
            interaction.client.functions
              .embed(interaction)
              .setDescription(
                interaction.client.functions.reply(
                  `Evaluated successfully:\n\`\`\`js\n${evaled}\`\`\``,
                  ":white_check_mark:"
                )
              ),
          ],
          ephemeral: isEphemeral,
        });
      } catch (error) {
        return interaction.followUp({
          embeds: [
            interaction.client.functions
              .embed(interaction)
              .setDescription(
                interaction.client.functions.reply(
                  `Evaluated with error:\n\`\`\`js\n${error?.stack}\`\`\``,
                  ":x:"
                )
              ),
          ],
          ephemeral: isEphemeral,
        });
      }
    }
  }
}
