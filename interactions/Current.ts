import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class CurrentCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "current",
      description: "Shows the current track, if there's any",
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
      const song = queue.songs[0];

      interaction.reply({
        content: interaction.client.functions.formatReply(
          "Here's some info about the current song:",
          interaction.client.config.emojis.check_mark
        ),
        embeds: [
          interaction.client.functions
            .buildEmbed(interaction)
            .setTitle(interaction.client.functions.escapeMd(song.name))
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addFields([
              {
                name: "Common info",
                value: `
**Duration:** ${song.duration != 0 ? song.formattedDuration : "Unknown"}
**Requested by:** ${song.user}
**Uploaded by:** ${
                  song.uploader.name
                    ? interaction.client.functions.escapeMd(song.uploader.name)
                    : "Unknown"
                }`,
                inline: true,
              },
              {
                name: "Details",
                value: `
**Likes:** ${song.source === "youtube" ? song.likes : "Not a YouTube video"}
**Views:** ${song.views !=0 ? song.views : "Unknown"}
**Live stream:** ${song.isLive ? "Yes" : "No"}
**Playlist:** ${
                  song.playlist
                    ? `${interaction.client.functions.escapeMd(
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
