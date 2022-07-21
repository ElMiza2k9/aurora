import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddSongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addSong", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, song: Song<any>) {
    song.metadata.i.followUp({
      embeds: [
        client.functions
          .buildEmbed(song.metadata.i)
          .setDescription(
            client.functions.formatReply(
              `Added **${client.functions.escapeMd(song.name)}** to the queue.`,
              client.config.emojis.check_mark
            )
          ),
      ],
    });
  }
}
