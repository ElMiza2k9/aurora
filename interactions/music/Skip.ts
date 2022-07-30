import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class SkipCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "skip",
      topName: "music",
      description: "Skips the current track, if it's not the last one",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true,
      true,
      true
    );
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (isChecked === true) {
      queue.skip();
      interaction.reply({
        embeds: [
          interaction.client.functions
            .buildEmbed(interaction)
            .setDescription(
              interaction.client.functions.formatReply(
                `Skipped **${interaction.client.functions.escapeMd(
                  queue.songs[0].name
                )}**.`,
                interaction.client.config.emojis.skip
              )
            ),
        ],
      });
    }
  }
}
