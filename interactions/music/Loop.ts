import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class LoopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "loop",
      topName: "music",
      description: "Manage player looping",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          description: "Loop mode",
          name: "mode",
          required: true,
          choices: [
            { name: "disabled", value: 0 },
            { name: "current song", value: 1 },
            { name: "entire queue", value: 2 },
          ],
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const connection =
      this.client.player.voices.get(interaction.guild.id) ||
      interaction.guild.members.me.voice;
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (!interaction.member.voice.channel) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:voice:not_in_voice"), ":x:")
            ),
        ],
      });
    } else if (
      interaction.guild.afkChannel &&
      interaction.member.voice.channel.id === interaction.guild.afkChannel.id
    ) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(this.client.reply(l("misc:voice:in_afk"), ":x:")),
        ],
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:voice:self_deaf"), ":x:")
            ),
        ],
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:voice:server_deaf"), ":x:")
            ),
        ],
      });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channel.id !==
        interaction.member.voice.channel.id
    ) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:voice:not_same_channel"), ":x:")
            ),
        ],
      });
    }

    if (!connection) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(
              this.client.reply(l("misc:voice:no_connection"), ":x:")
            ),
        ],
      });
    }

    if (!queue) {
      return interaction.followUp({
        embeds: [
          this.client
            .embed(interaction)
            .setDescription(this.client.reply(l("misc:voice:no_queue"), ":x:")),
        ],
      });
    }

    const mode = await interaction.options.get("mode");

    queue?.setRepeatMode(mode.value);
    await interaction.followUp({
      embeds: [
        this.client
          .embed(interaction)
          .setDescription(
            this.client.reply(
              mode.value > 0
                ? l("commands:music:loop:enabled", { mode: l(`misc:loop_modes:${queue.repeatMode}`)})
                : l("commands:music:loop:disabled"),
              ":white_check_mark:"
            )
          ),
      ],
    });
  }
}
