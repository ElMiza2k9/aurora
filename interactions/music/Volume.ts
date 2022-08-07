import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class LoopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "volume",
      topName: "music",
      description: "Adjust player volume",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          description: "New player volume",
          name: "volume",
          required: true,
          minValue: 1,
          maxValue: 100,
        },
      ],
    });
  }
  async execute(interaction) {
    const isChecked = await interaction.client.functions.checkVoice(
      interaction,
      true,
      true
    );

    if (isChecked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const volume = await interaction.options.getInteger("volume");
      queue.setVolume(volume);
      interaction.reply({
        embeds: [
          interaction.client.functions
            .embed(interaction)
            .setDescription(
              interaction.client.functions.reply(
                `Set the volume to ${queue.volume}%.`,
                ":white_check_mark:"
              )
            ),
        ],
      });
    }
  }
}
