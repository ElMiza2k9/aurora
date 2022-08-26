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
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );

      if (queue.paused) {
        return interaction.followUp({
          content: this.client.reply(
            l("commands:music:pause:already_paused"),
            ":pause_button:"
          ),
        });
      }
      queue?.pause();
      await interaction.followUp({
        content: this.client.reply(
          l("commands:music:pause:paused"),
          ":pause_button:"
        ),
      });
    }
  }
}
