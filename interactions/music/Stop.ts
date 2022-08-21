import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class StopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "stop",
      topName: "music",
      description: "Stops music playback and destroys a voice connection",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
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
      embeds: [
        this.client
          .embed(interaction)
          .setDescription(
            this.client.reply(
              l("commands:music:stop:stopped"),
              ":stop_button:"
            )
          ),
      ],
    });
  }
}
