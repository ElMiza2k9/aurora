import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class MusicPlayCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "play",
      topName: "music",
      description: "Play a song",
      client_perms: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
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
    const checked = await this.client.vc(
      interaction,
      l,
      false,
      false,
      false,
      true
    );

    if (checked === true) {
      const query = await interaction.options.getString("query");

      try {
        await this.client.player.play(interaction.member.voice.channel, query, {
          textChannel: interaction.channel,
          member: interaction.member,
          metadata: { i: interaction },
        });
      } catch (error) {
        interaction.followUp({
          content: this.client.reply(
            l("misc:error", { error: error.name }),
            ":x:"
          ),
        });
      }
    }
  }
}
