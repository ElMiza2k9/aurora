import { escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class MusicSkipCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "skip",
      topName: "music",
      description: "Skips the current track, if it's not the last one",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      queue?.skip();
      await interaction.followUp({
        content: this.client.reply(
          l("commands:music:skip:skipped", {
            song: `**${escapeMarkdown(`${queue.songs[0].name}`)}**`,
          }),
          ":track_next:"
        ),
      });
    }
  }
}
