import { escapeMarkdown } from "discord.js";
import { Playlist, Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addList", false, true);
  }

  async execute(
    client: AuroraClient,
    _queue: Queue,
    playlist: Playlist<any>,
    l
  ) {
    playlist.metadata.i.followUp({
      content: client.functions.reply(
        `Added **${escapeMarkdown(playlist.name as string)}** (${
          playlist.songs.length
        } songs) to the queue.`,
        ":white_check_mark:"
      ),
      embeds: [
        playlist.metadata.i.client.functions
          .embed(playlist.metadata.i)
          .setTitle(escapeMarkdown(playlist.name))
          .setURL(playlist.url)
          .setThumbnail(playlist.thumbnail)
          .addFields([
            {
              name: "Common info",
              value: `
**Duration:** ${
                playlist.duration != 0
                  ? playlist.formattedDuration
                  : l("misc:unknown")
              }
**Requested by:** ${playlist.user}`,
              inline: true,
            },
            {
              name: `Songs (${
                playlist.songs.length > 10
                  ? `1-10/${playlist.songs.length}`
                  : playlist.songs.length
              })`,
              value: playlist.songs
                .map((song, pos) => {
                  return `#${pos + 1}. **${escapeMarkdown(
                    song.name as string
                  )}** \`[${song.formattedDuration}]\``;
                })
                .slice(0, 10)
                .join("\n"),
            },
          ]),
      ],
    });
  }
}
