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
  async execute(interaction, l) {
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const volume = await interaction.options.getInteger("volume");
      queue.setVolume(volume);
      interaction.reply({
        content: interaction.client.reply(
          l("commands:music:volume:changed", { volume: `${queue.volume}%` }),
          ":white_check_mark:"
        ),
      });
    }
  }
}
