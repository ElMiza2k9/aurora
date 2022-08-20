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

    const song = queue.songs[0];

    await interaction.followUp({
      content: this.client.functions.reply(
        "Here's some info about the current song:",
        ":white_check_mark:"
      ),
      embeds: [
        this.client.functions
          .embed(interaction)
          .setTitle(escapeMarkdown(song.name as string))
          .setURL(song.url)
          .setThumbnail(song.thumbnail ? song.thumbnail : null)
          .addFields([
            {
              name: "Common info",
              value: `
**Duration:** ${
                song.source === "youtube"
                  ? song.formattedDuration
                  : l("misc:unknown")
              }
**Requested by:** ${song.user}
**Uploaded by:** ${
                song.uploader.name
                  ? escapeMarkdown(song.uploader.name)
                  : l("misc:unknown")
              }`,
              inline: true,
            },
            {
              name: "Details",
              value: `
**Views:** ${song.source === "youtube" ? song.views : l("misc:unknown")}
**Live stream:** ${song.isLive ? l("misc:true") : l("misc:false")}
**Playlist:** ${
                song.playlist
                  ? `${escapeMarkdown(song.playlist.name)} (${
                      song.playlist.songs.length
                    } songs)`
                  : "No playlist"
              }
              `,
              inline: true,
            },
          ]),
      ],
    });
  }
}
