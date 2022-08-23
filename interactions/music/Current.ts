import { escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class CurrentCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "current",
      topName: "music",
      description: "Shows the current track, if there's any",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );

      const song = queue.songs[0];

      await interaction.followUp({
        content: this.client.reply(
          l("misc:music:now_playing", {
            song: `**${escapeMarkdown(`${song.name}`)}**`,
          }),
          queue.paused ? ":pause_button:" : ":arrow_forward:"
        ),
        embeds: [
          this.client
            .embed(interaction)
            .setAuthor({
              name: song.uploader.name ?? l("misc:unknown"),
              url: `${song.uploader.url ?? null}`,
              iconURL: `${song.thumbnail ?? null}`,
            })
            .setTitle(escapeMarkdown(`${song.name}`))
            .setURL(song.url)
            .setThumbnail(song.thumbnail ?? null)
            .addFields([
              {
                name: l("misc:music:duration"),
                value: `${
                  song.formattedDuration !== "00:00"
                    ? song.formattedDuration
                    : l("misc:unknown")
                }`,
                inline: true,
              },
              {
                name: l("misc:music:requested_by"),
                value: `${song.user}`,
                inline: true,
              },
              {
                name: l("misc:music:volume"),
                value: `${queue.volume}%`,
                inline: true,
              },
            ]),
        ],
      });
    }
  }
}
