import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class PauseCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "pause",
      topName: "music",
      description: "Pauses music playback",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true,
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
            .embed(interaction)
            .setDescription(
              interaction.client.functions.reply(
                "Paused the playback.",
                ":pause_button:"
              )
            ),
        ],
      });
    }
  }
}
