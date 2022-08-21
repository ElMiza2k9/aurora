import { escapeMarkdown } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class QueueCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "queue",
      topName: "music",
      description: "Shows server queue",
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

    await interaction.followUp({
      content: `${this.client.reply(
        `Here's the queue for **${escapeMarkdown(interaction.guild.name)}** (${
          queue.songs.length > 11
            ? `1-10/${queue.songs.length}`
            : queue.songs.length
        } songs):`,
        queue.paused ? ":pause_button:" : ":arrow_forward:"
      )}`,
      embeds: [
        this.client.embed(interaction).addFields([
          {
            name: l("commands:music:queue:fields:now_playing"),
            value: `**[${escapeMarkdown(`${queue.songs[0].name}`)}](${
              queue.songs[0].url
            })** \`[${queue.songs[0].formattedDuration}]\``,
          },
          {
            name: l("commands:music:queue:fields:up_next:name"),
            value:
              queue.songs.length > 1
                ? queue.songs
                    .slice(1)
                    .map((song, pos) => {
                      return `#${pos + 1}. **[${escapeMarkdown(
                        `${song.name}`
                      )}](${song.url})** \`[${song.formattedDuration}]\``;
                    })
                    .slice(0, 10)
                    .join("\n")
                : l("commands:music:queue:fields:up_next:nothing"),
          },
          {
            name: l("commands:music:queue:fields:queue_length"),
            value: queue.formattedDuration,
            inline: true,
          },
          {             name: l("commands:music:queue:fields:volume"),
          value: `${queue.volume}%`, inline: true },
          {
            name: l("commands:music:queue:fields:loop_mode"),
            value: l(`misc:loop_modes:${queue.repeatMode}`),
            inline: true,
          },
        ]),
      ],
    });
  }
}
