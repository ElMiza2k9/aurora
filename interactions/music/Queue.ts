import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class QueueCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "queue",
      topName: "music",
      description: "Shows server queue",
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true,
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
        .slice(0, 10)
        .join("\n");

      const embed = interaction.client.functions
        .buildEmbed(interaction)
        .setDescription(
          `${interaction.client.functions.formatReply(
            `Here's the queue for **${interaction.client.functions.escapeMd(
              interaction.guild.name
            )}** (${
              queue.songs.length > 10
                ? `1-10/${queue.songs.length}`
                : queue.songs.length
            } songs):`,
            queue.paused
              ? interaction.client.config.emojis.pause
              : interaction.client.config.emojis.play
          )}\n${songs}`
        );

      interaction.reply({
        embeds: [embed],
      });
    }
  }
}
