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
      });
    }

    const loopModes = {
      0: "Disabled",
      1: "Current song",
      2: "Entire queue",
    };

    await interaction.followUp({
      content: `${this.client.functions.reply(
        `Here's the queue for **${escapeMarkdown(interaction.guild.name)}** (${
          queue.songs.length > 11
            ? `1-10/${queue.songs.length}`
            : queue.songs.length
        } songs):`,
        queue.paused ? ":pause_button:" : ":arrow_forward:"
      )}`,
      embeds: [
        this.client.functions.embed(interaction).addFields([
          {
            name: "Now playing",
            value: `**[${escapeMarkdown(queue.songs[0].name as string)}](${
              queue.songs[0].url
            })** \`[${queue.songs[0].formattedDuration}]\``,
          },
          {
            name: "Up next",
            value:
              queue.songs.length > 1
                ? queue.songs
                    .slice(1)
                    .map((song, pos) => {
                      return `#${pos + 1}. **[${escapeMarkdown(
                        song.name as string
                      )}](${song.url})** \`[${song.formattedDuration}]\``;
                    })
                    .slice(0, 10)
                    .join("\n")
                : "Nothing yet...",
          },
          {
            name: "Queue length",
            value: queue.formattedDuration,
            inline: true,
          },
          { name: "Volume", value: `${queue.volume}%`, inline: true },
          {
            name: "Loop mode",
            value: loopModes[queue.repeatMode],
            inline: true,
          },
        ]),
      ],
    });
  }
}
