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
        l("misc:music:now_playing", { song: escapeMarkdown(`${song.name}`) }),
        ":arrow_forward:"
      ),
      embeds: [
        client
          .embed(song.metadata.i)
          .setAuthor({
            name: song.uploader.name ?? l("misc:unknown"),
            url: `${song.uploader.url ?? null}`,
            iconURL: `${song.thumbnail ?? null}`,
          })
          .setTitle(escapeMarkdown(`${song.name}`))
          .setURL(song.url)
          .setThumbnail(`${song.thumbnail}`)
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
