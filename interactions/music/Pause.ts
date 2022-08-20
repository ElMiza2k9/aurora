import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class PauseCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "pause",
      topName: "music",
      description: "Pauses music playback",
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const connection =
      this.client.functions.client.player.voices.get(interaction.guild.id) ||
      interaction.guild.members.me.voice;
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (!interaction.member.voice.channel) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:not_in_voice"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    } else if (
      interaction.guild.afkChannel &&
      interaction.member.voice.channel.id === interaction.guild.afkChannel.id
    ) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:in_afk"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:self_deaf"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:server_deaf"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channel.id !==
        interaction.member.voice.channel.id
    ) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(
                l("misc:voice:not_same_channel"),
                ":x:"
              )
            ),
        ],
        ephemeral: true,
      });
    }

    if (!connection) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:no_connection"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    }

    if (!queue) {
      return interaction.followUp({
        embeds: [
          this.client.functions
            .embed(interaction)
            .setDescription(
              this.client.functions.reply(l("misc:voice:no_queue"), ":x:")
            ),
        ],
        ephemeral: true,
      });
    }

    queue?.pause();
    await interaction.followUp({
      embeds: [
        this.client.functions
          .embed(interaction)
          .setDescription(
            this.client.functions.reply(l("misc:true"), ":pause_button:")
          ),
      ],
    });
  }
}
