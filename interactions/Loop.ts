import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class LoopCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "loop",
      description: "Manage player looping",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          description: "Loop mode",
          name: "mode",
          required: true,
          choices: [
            { name: "disabled", value: 0 },
            { name: "current song", value: 1 },
            { name: "entire queue", value: 2 },
          ],
        },
      ],
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true,
      true
    );
    const mode = await interaction.options.get("mode");
    const modeNames = {
      0: "disabled",
      1: "current song",
      2: "entire queue"
    };

    if (isChecked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      queue.setRepeatMode(mode.value);
      interaction.reply({
        embeds: [
          interaction.client.functions
            .buildEmbed(interaction)
            .setDescription(
              interaction.client.functions.formatReply(
                mode.value > 0
                  ? `Loop mode set to **${modeNames[mode.value]}**.`
                  : "Disabled player looping.",
                interaction.client.config.emojis.check_mark
              )
            ),
        ],
      });
    }
  }
}
