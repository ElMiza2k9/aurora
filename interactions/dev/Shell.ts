import { ApplicationCommandOptionType } from "discord.js";
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
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "ephemeral",
          description: "Whether to send the result as an ephemeral message",
          required: true,
        },
      ],
    });
  }
  async execute(interaction) {
    const isOwner = interaction.client.functions.checkOwner(interaction);
    const code = interaction.options.getString("code");
    const isEphemeral = interaction.options.getBoolean("ephemeral");

    if (isOwner === true) {
      try {
        await interaction.deferReply();
        let evaled = await require("child_process")
          .execSync(code)
          .toString("utf8")
          .split(2000);

        interaction.followUp({
          embeds: [
            interaction.client.functions
              .embed(interaction)
              .setDescription(
                interaction.client.functions.reply(
                  `Evaluated successfully:\n\`\`\`sh\n${
                    evaled != "" ? evaled : "No response"
                  }\`\`\``,
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
                  `Evaluated with error:\n\`\`\`sh\n${error?.stack}\`\`\``,
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
