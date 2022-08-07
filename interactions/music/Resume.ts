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
        embeds: [
          interaction.client.functions
            .embed(interaction)
            .setDescription(
              interaction.client.functions.reply(
                "Resumed the playback.",
                ":arrow_forward:"
              )
            ),
        ],
      });
    }
  }
}
