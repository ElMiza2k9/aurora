import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class PauseCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "pause",
      description: "Pauses music playback",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true
    );
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (isChecked === true) {
      queue.pause();
      interaction.reply({
        embeds: [
          interaction.client.functions
            .buildEmbed(interaction)
            .setDescription(
              interaction.client.functions.formatReply(
                "Paused the playback.",
                interaction.client.config.emojis.pause
              )
            ),
        ],
      });
    }
  }
}
