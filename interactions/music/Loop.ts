import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class MusicLoopCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "loop",
      topName: "music",
      description: "Manage player looping",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          description: "Loop mode",
          name: "mode",
          required: true,
          choices: [
            { name: "disabled", value: 0 },
            { name: "current song", value: 1 },
            { name: "entire queue", value: 2 },
          ],
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const checked = await this.client.vc(interaction, l, true, true);

    if (checked === true) {
      const queue = await interaction.client.player.queues.get(
        interaction.guild.id
      );
      const mode = await interaction.options.get("mode");

      queue?.setRepeatMode(mode.value);
      await interaction.followUp({
        content: this.client.reply(
          mode.value > 0
            ? l("commands:music:loop:enabled", {
                mode: l(`misc:loop_modes:${queue.repeatMode}`),
              })
            : l("commands:music:loop:disabled"),
          ":white_check_mark:"
        ),
      });
    }
  }
}
