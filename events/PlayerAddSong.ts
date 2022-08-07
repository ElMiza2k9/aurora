import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddSongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addSong", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, song: Song<any>) {
    song.metadata.i.followUp({
      content: client.functions.reply(
        `Added **${client.functions.escapeMd(song.name)}** to the queue.`,
        ":white_check_mark:"
      ),
      embeds: [
        song.metadata.i.client.functions
          .embed(song.metadata.i)
          .setTitle(song.metadata.i.client.functions.escapeMd(song.name))
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
                  ? song.metadata.i.client.functions.escapeMd(
                      song.uploader.name
                    )
                  : "Unknown"
              }`,
              inline: true,
            },
            {
              name: "Details",
              value: `
**Likes:** ${song.source === "youtube" ? song.likes : "Not a YouTube video"}
**Views:** ${song.views != 0 ? song.views : "Unknown"}
**Live stream:** ${song.isLive ? "Yes" : "No"}
**Playlist:** ${
                song.playlist
                  ? `${song.metadata.i.client.functions.escapeMd(
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
