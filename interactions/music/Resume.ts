import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ResumeCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "resume",
      topName: "music",
      description: "Resumes music playback",
    });
  }
  async execute(interaction, l) {
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      queue?.resume();
      await interaction.followUp({
        content: this.client.reply(
          l("commands:music:resume:resumed"),
          ":arrow_forward:"
        ),
      });
    }
  }
}
