import { escapeMarkdown } from "discord.js";
import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerPlaySongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "playSong", false, true);
  }

  async execute(client: AuroraClient, queue: Queue, song: Song<any>) {
    const l = await client.locales.getLocale(
      song.metadata.i.guild.id,
      song.metadata.i.user.id
    );

    song.metadata.i.followUp({
      content: client.reply(
        l("misc:music:now_playing", {
          song: `**${escapeMarkdown(`${song.name}`)}**`,
        }),
        ":arrow_forward:"
      ),
      embeds: [
        (await client
          .embed(song.metadata.i))
          .setAuthor({
            name: song.uploader.name ?? l("misc:music:unknown_author"),
            url: song.uploader?.url,
            iconURL: song?.thumbnail,
          })
          .setTitle(escapeMarkdown(`${song.name}`))
          .setURL(song.url)
          .setThumbnail(song.thumbnail ?? null)
          .addFields([
            {
              name: l("misc:music:duration"),
              value: `${
                song.duration !== 0 ? song.formattedDuration : l("misc:unknown")
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
