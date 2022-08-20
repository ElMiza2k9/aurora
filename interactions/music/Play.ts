import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class PlayCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "play",
      topName: "music",
      description: "Play a song",
      options: [
        {
          description: "The URL or query to the song",
          name: "query",
          required: true,
          type: ApplicationCommandOptionType.String,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
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

    const query = await interaction.options.getString("query");

    try {
      this.client.player.play(interaction.member.voice.channel, query, {
        textChannel: interaction.channel,
        member: interaction.member,
        metadata: { i: interaction },
      });
    } catch (error) {
      interaction.followUp({
        content: l("misc:error", { error: error.name }),
      });
    }
  }
}
