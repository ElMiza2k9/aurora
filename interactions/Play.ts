import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class PlayCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "play",
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
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: "You're not in a voice channel.",
        ephemereal: true,
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.reply({ content: "You've deafened yourself." });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.reply({ content: "You're deafened server-wide." });
    } else if (
      interaction.client.voice.channel &&
      interaction.client.voice.channelId !== interaction.member.voice.channelId
    ) {
      return interaction.reply({
        content: "You're not in the same voice channel as me.",
      });
    }

    const query = await interaction.options.getString("query");
    try {
      interaction.deferReply();
      this.client.player.play(interaction.member.voice.channel, query, {
        textChannel: interaction.channel,
        member: interaction.member,
        metadata: { i: interaction },
      });
    } catch (error) {
      interaction.followUp({ content: error });
    }
  }
}
