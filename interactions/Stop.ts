import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class StopCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "stop",
      description: "Stops music playback and destroys a voice connection",
    });
  }
  async execute(interaction) {
    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );
    const connection = await interaction.client.player.voices.get(
      interaction.guild.id
    );

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
    } else if (!queue && !connection) {
      return interaction.reply(
        "There's no queue and/or voice connection in this server."
      );
    }

    connection.leave();
    interaction.reply({
      content: "Cleared the queue and destroyed the voice connection.",
    });
  }
}
