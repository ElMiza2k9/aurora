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
    const isChecked = await interaction.client.functions.voice(
      interaction,
      l,
      true,
      true
    );

    if (isChecked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const song = queue.songs[0];

      interaction.reply({
        content: interaction.client.functions.reply(
          "Here's some info about the current song:",
          ":white_check_mark:"
        ),
        embeds: [
          interaction.client.functions
            .embed(interaction)
            .setTitle(interaction.client.functions.md(song.name))
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addFields([
              {
                name: "Common info",
                value: `
**Duration:** ${
                  song.source === "youtube"
                    ? song.formattedDuration
                    : l("misc:unknown")
                }
**Requested by:** ${song.user}
**Uploaded by:** ${
                  song.uploader.name
                    ? interaction.client.functions.md(song.uploader.name)
                    : l("misc:unknown")
                }`,
                inline: true,
              },
              {
                name: "Details",
                value: `
**Views:** ${song.source === "youtube" ? song.views : l("misc:unknown")}
**Live stream:** ${song.isLive ? l("misc:true") : l("misc:false")}
**Playlist:** ${
                  song.playlist
                    ? `${interaction.client.functions.md(
                        song.playlist.name
                      )} (${song.playlist.songs.length} songs)`
                    : "No playlist"
                }
              `,
                inline: true,
              },
            ]),
        ],
      });
    }
  }
}
