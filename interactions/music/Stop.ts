import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class StopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "stop",
      topName: "music",
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
        embeds: [
          interaction.client.functions
            .embed(interaction)
            .setDescription(
              interaction.client.functions.reply(
                "Cleared the queue and destroyed the voice connection.",
                ":stop_button:"
              )
            ),
        ],
      });
    }
  }
}
