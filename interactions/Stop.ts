import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class StopCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "stop",
      description: "Stops music playback and destroys a voice connection",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true
    );
    const connection = await interaction.client.player.voices.get(
      interaction.guild.id
    );

    if (isChecked === true) {
      connection.leave();
      interaction.reply({
        content: interaction.client.functions.formatReply(
          "Cleared the queue and destroyed the voice connection.",
          interaction.client.config.emojis.check_mark
        ),
      });
    }
  }
}
