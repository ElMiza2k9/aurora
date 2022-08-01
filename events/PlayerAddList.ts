import { Playlist, Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addList", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, playlist: Playlist<any>) {
    playlist.metadata.i.followUp({
      content: client.functions.formatReply(
        `Added **${client.functions.escapeMd(playlist.name)}** (${
          playlist.songs.length
        } songs) to the queue.`,
        client.config.emojis.check_mark
      ),
      embeds: [
        playlist.metadata.i.client.functions
          .buildEmbed(playlist.metadata.i)
          .setTitle(
            playlist.metadata.i.client.functions.escapeMd(playlist.name)
          )
          .setURL(playlist.url)
          .setThumbnail(playlist.thumbnail)
          .addFields([
            {
              name: "Common info",
              value: `
**Duration:** ${playlist.duration != 0 ? playlist.formattedDuration : "Unknown"}
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
                  return `#${pos + 1}. **${client.functions.escapeMd(
                    song.name
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
