import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class QueueCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "queue",
      description: "Shows server queue",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true
    );

    if (isChecked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const songs = queue.songs
        .map((song, pos) => {
          return `${pos === 0 ? `Current:` : `#${pos}.`} ${song.name} \`[${
            song.formattedDuration
          }]\``;
        })
        .slice(0, 10)
        .join("\n");
      interaction.reply({
        content: interaction.client.functions.formatReply(
          `Here's the queue for ${interaction.client.functions.escapeMd(
            interaction.guild.name
          )} (first 10 tracks):\n${songs}`,
          interaction.client.config.emojis.check_mark
        ),
      });
    }
  }
}
