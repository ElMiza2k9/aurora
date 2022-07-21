import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";
import { inspect } from "node:util";

export default class EvalCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "eval",
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
  async execute(interaction) {
    const isOwner = interaction.client.functions.checkOwner(interaction);

    if (isOwner === true) {
      try {
        const code = interaction.options.getString("code");
        let evaled = await eval(code);

        evaled = inspect(evaled, {
          depth: 0,
          maxArrayLength: null,
        });

        interaction.reply({
          embeds: [
            interaction.client.functions
              .buildEmbed(interaction)
              .setDescription(
                interaction.client.functions.formatReply(
                  `Evaluated successfully:\n\`\`\`js\n${evaled}\`\`\``,
                  interaction.client.config.emojis.check_mark
                )
              ),
          ],
        });
      } catch (error) {
        return interaction.reply({
          embeds: [
            interaction.client.functions
              .buildEmbed(interaction)
              .setDescription(
                interaction.client.functions.formatReply(
                  `Evaluated with error:\n\`\`\`js\n${error?.stack}\`\`\``,
                  interaction.client.config.emojis.cross_mark
                )
              ),
          ],
        });
      }
    }
  }
}
