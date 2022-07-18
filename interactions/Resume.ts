import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class ResumeCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "resume",
      description: "Resumes music playback",
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
      queue.resume();
      interaction.reply({
        content: interaction.client.functions.formatReply(
          "Resumed the playback.",
          interaction.client.config.emojis.play
        ),
      });
    }
  }
}
