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
          return `${
            pos === 0 ? `Current:` : `#${pos}.`
          } **${interaction.client.functions.escapeMd(song.name)}** \`[${
            song.formattedDuration
          }]\``;
        })
        .slice(0, 11)
        .join("\n");
      interaction.reply({
        content: interaction.client.functions.formatReply(
          `Here's the queue for **${interaction.client.functions.escapeMd(
            interaction.guild.name
          )}** (${
            queue.songs.length > 10 ? "first 10" : queue.songs.length
          } tracks):\n${songs}`,
          queue.paused
            ? interaction.client.config.emojis.pause
            : interaction.client.config.emojis.play
        ),
      });
    }
  }
}
