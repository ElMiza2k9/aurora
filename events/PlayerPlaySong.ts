import { Queue, Song } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerPlaySongEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "playSong", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, song: Song<any>) {
    song.metadata.i.followUp({
      embeds: [
        client.functions
          .buildEmbed(song.metadata.i)
          .setDescription(
            client.functions.formatReply(
              `Started playing **${client.functions.escapeMd(song.name)}**.`,
              client.config.emojis.play
            )
          ),
      ],
    });
  }
}
