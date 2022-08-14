import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerPlaySongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "playSong", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, song: Song<any>, l) {
    song.metadata.i.followUp({
      content: client.functions.reply(
        `Started playing **${client.functions.md(song.name)}**.`,
        ":arrow_forward:"
      ),
      embeds: [
        song.metadata.i.client.functions
          .embed(song.metadata.i)
          .setTitle(song.metadata.i.client.functions.md(song.name))
          .setURL(song.url)
          .setThumbnail(song.thumbnail)
          .addFields([
            {
              name: "Common info",
              value: `
**Duration:** ${song.duration != 0 ? song.formattedDuration : l("misc:unknown")}
**Requested by:** ${song.user}
**Uploaded by:** ${
                song.uploader.name
                  ? song.metadata.i.client.functions.md(song.uploader.name)
                  : l("misc:unknown")
              }`,
              inline: true,
            },
            {
              name: "Details",
              value: `
**Views:** ${song.views != 0 ? song.views : l("misc:unknown")}
**Live stream:** ${song.isLive ? l("misc:true") : l("misc:false")}
**Playlist:** ${
                song.playlist
                  ? `${song.metadata.i.client.functions.md(
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
