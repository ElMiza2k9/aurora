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
    const isChecked = await interaction.client.functions.checkVoice(
      interaction
    );
    const query = await interaction.options.getString("query");

    if (isChecked === true) {
      try {
        this.client.player.play(interaction.member.voice.channel, query, {
          textChannel: interaction.channel,
          member: interaction.member,
          metadata: { i: interaction },
        });
        interaction.deferReply();
      } catch (error) {
        interaction.followUp({ content: error });
      }
    }
  }
}
