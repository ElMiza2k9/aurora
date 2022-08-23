import { escapeMarkdown } from "discord.js";
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
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      await interaction.followUp({
        content: this.client.reply(
          l("commands:music:queue:reply", {
            server: `**${escapeMarkdown(interaction.guild.name)}**`,
          }),
          queue.paused ? ":pause_button:" : ":arrow_forward:"
        ),
        embeds: [
          this.client.embed(interaction).addFields([
            {
              name: l("commands:music:queue:fields:now_playing"),
              value: `**[${escapeMarkdown(`${queue.songs[0].name}`)}](${
                queue.songs[0].url
              })** / ${
                queue.songs[0].duration !== 0
                  ? queue.songs[0].formattedDuration
                  : l("misc:unknown")
              } / ${queue.songs[0].user}`,
            },
            {
              name: l("commands:music:queue:fields:up_next:name"),
              value:
                queue.songs.length > 1
                  ? queue.songs
                      .slice(1)
                      .map((song, pos) => {
                        return `#${pos + 1}. **[${escapeMarkdown(
                          `${song.name}`
                        )}](${song.url})** / ${
                          song.duration !== 0
                            ? song.formattedDuration
                            : l("misc:unknown")
                        } / ${song.user}`;
                      })
                      .slice(0, 10)
                      .join("\n")
                  : l("commands:music:queue:fields:up_next:nothing"),
            },
            {
              name: l("commands:music:queue:fields:queue_length"),
              value: `${
                queue.duration !== 0
                  ? queue.formattedDuration
                  : l("misc:unknown")
              }`,
              inline: true,
            },
            {
              name: l("commands:music:queue:fields:volume"),
              value: `${queue.volume}%`,
              inline: true,
            },
            {
              name: l("commands:music:queue:fields:loop_mode"),
              value: l(`misc:loop_modes:${queue.repeatMode}`),
              inline: true,
            },
          ]),
        ],
      });
    }
  }
}
