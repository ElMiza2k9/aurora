import { escapeMarkdown } from "discord.js";
import { Playlist, Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addList", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, playlist: Playlist<any>) {
    const l = await client.locales.getLocale(
      playlist.metadata.i.guild.id,
      playlist.metadata.i.user.id
    );

    playlist.metadata.i.followUp({
      content: client.reply(
        l("misc:music:playlist_added", {
          playlist: `**${escapeMarkdown(`${playlist.name}`)}**`,
          songs: `${playlist.songs.length}`,
        }),
        ":white_check_mark:"
      ),
      embeds: [
        this.client
          .embed(playlist.metadata.i)
          .setTitle(escapeMarkdown(playlist.name))
          .setURL(`${playlist.url}`)
          .setThumbnail(playlist.thumbnail ?? null)
          .addFields([
            {
              name: "Duration",
              value:
                playlist.duration !== 0
                  ? playlist.formattedDuration
                  : l("misc:unknown"),
              inline: true,
            },
            { name: "Requested by", value: `${playlist.user}`, inline: true },
            {
              name: `Songs (${
                playlist.songs.length > 10
                  ? `1-10/${playlist.songs.length}`
                  : playlist.songs.length
              })`,
              value: playlist.songs
                .map((song, pos) => {
                  return `#${pos + 1}. **${escapeMarkdown(
                    `${song.name}`
                  )}** / ${song.formattedDuration}`;
                })
                .slice(0, 10)
                .join("\n"),
            },
          ]),
      ],
    });
  }
}
