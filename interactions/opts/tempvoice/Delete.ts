import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { AuroraClient } from "../../../structures/AuroraClient";
import { SubCommand } from "../../../structures/SubCommand";

export default class OptsTempvoiceDeleteCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "delete",
      groupName: "tempvoice",
      topName: "opts",
      user_perms: [PermissionFlagsBits.ManageGuild],
      description: "Create a new voice trigger",
      options: [
        {
          name: "channel",
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildVoice],
          description: "A trigger channel",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel");

    const dbChannel = await this.client.tempvoices.find(channel.id);

    if (dbChannel.length === 0) {
      return interaction.followUp({
        content: this.client.reply(
          l("commands:opts:tempvoice:delete:no_trigger", {
            channel: `${channel}`,
          }),
          ":x:"
        ),
      });
    }

    await this.client.tempvoices.delete(channel.id);

    await interaction.followUp({
      content: this.client.reply(
        l("commands:opts:tempvoice:delete:deleted", { channel: `${channel}` }),
        ":white_check_mark:"
      ),
    });
  }
}
