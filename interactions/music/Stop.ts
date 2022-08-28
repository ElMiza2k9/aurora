import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class MusicStopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "stop",
      topName: "music",
      description: "Stops music playback and destroys a voice connection",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true);

    if (checked === true) {
      const distubeConnection = await this.client.player.voices.get(
        interaction.guild.id
      );
      const voiceConnection = interaction.guild.members.me.voice;

      if (distubeConnection) {
        distubeConnection.leave();
      } else {
        voiceConnection.disconnect();
      }
      await interaction.followUp({
        content: this.client.reply(
          l("commands:music:stop:stopped"),
          ":stop_button:"
        ),
      });
    }
  }
}
