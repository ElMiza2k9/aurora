import { escapeMarkdown } from "discord.js";
import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddSongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addSong", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, song: Song<any>, l) {
    song.metadata.i.followUp({
      content: client.functions.reply(
        `Added **${escapeMarkdown(song.name as string)}** to the queue.`,
        ":white_check_mark:"
      ),
      embeds: [
        song.metadata.i.client.functions
          .embed(song.metadata.i)
          .setTitle(escapeMarkdown(song.name as string))
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
                  ? escapeMarkdown(song.uploader.name as string)
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
                  ? `${escapeMarkdown(song.playlist.name)} (${
                      song.playlist.songs.length
                    } songs)`
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
