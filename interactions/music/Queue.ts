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

    const loopModes = {
      0: "Disabled",
      1: "Current song",
      2: "Entire queue",
    };

    if (isChecked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );

      interaction.reply({
        content: `${interaction.client.functions.reply(
          `Here's the queue for **${interaction.client.functions.md(
            interaction.guild.name
          )}** (${
            queue.songs.length > 11
              ? `1-10/${queue.songs.length}`
              : queue.songs.length
          } songs):`,
          queue.paused ? ":pause_button:" : ":arrow_forward:"
        )}`,
        embeds: [
          interaction.client.functions.embed(interaction).addFields([
            {
              name: "Now playing",
              value: `**[${interaction.client.functions.md(
                queue.songs[0].name
              )}](${queue.songs[0].url})** \`[${
                queue.songs[0].formattedDuration
              }]\``,
            },
            {
              name: "Up next",
              value:
                queue.songs.length > 1
                  ? queue.songs
                      .slice(1)
                      .map((song, pos) => {
                        return `#${
                          pos + 1
                        }. **[${interaction.client.functions.md(song.name)}](${
                          song.url
                        })** \`[${song.formattedDuration}]\``;
                      })
                      .slice(0, 10)
                      .join("\n")
                  : "Nothing yet...",
            },
            {
              name: "Queue length",
              value: queue.formattedDuration,
              inline: true,
            },
            { name: "Volume", value: `${queue.volume}%`, inline: true },
            {
              name: "Loop mode",
              value: loopModes[queue.repeatMode],
              inline: true,
            },
          ]),
        ],
      });
    }
  }
}
