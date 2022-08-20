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
  async execute(interaction, _l) {
    await interaction.deferReply();
    const queue = await this.client.player.queues.get(interaction.guild.id);

    queue?.resume();
    await interaction.followUp({
      embeds: [
        this.client.functions
          .embed(interaction)
          .setDescription(
            this.client.functions.reply(
              "Resumed the playback.",
              ":arrow_forward:"
            )
          ),
      ],
    });
  }
}
