import { Playlist, Queue } from "distube";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class PlayerAddListEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "addList", false, true);
  }

  async execute(client: AuroraClient, _queue: Queue, playlist: Playlist<any>) {
    playlist.metadata.i.followUp({
      embeds: [
        client.functions
          .buildEmbed(playlist.metadata.i)
          .setDescription(
            client.functions.formatReply(
              `Added **${client.functions.escapeMd(playlist.name)}** (${
                playlist.songs.length
              } songs) to the queue.`,
              client.config.emojis.check_mark
            )
          ),
      ],
    });
  }
}
