import { escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class CurrentCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "current",
      topName: "music",
      description: "Shows the current track, if there's any",
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

    const song = queue.songs[0];

    await interaction.followUp({
      content: this.client.reply(
        l("misc:music:now_playing", { song: escapeMarkdown(`${song.name}`) }),
        queue.paused ? ":pause_button:" : ":arrow_forward:"
      ),
      embeds: [
        this.client
          .embed(interaction)
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
