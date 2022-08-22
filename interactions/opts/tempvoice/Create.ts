import {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { AuroraClient } from "../../../structures/AuroraClient";
import { SubCommand } from "../../../structures/SubCommand";

export default class OptsTempvoiceCreateCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "create",
      groupName: "tempvoice",
      topName: "opts",
      client_perms: [
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.MoveMembers,
      ],
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
        {
          name: "category",
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildCategory],
          description: "A category where child channels will be created",
          required: true,
        },
        {
          name: "delete-if-empty",
          type: ApplicationCommandOptionType.Boolean,
          description:
            "Whether to delete child channel if it's empty (default: true)",
        },
        {
          name: "delete-if-no-owner",
          type: ApplicationCommandOptionType.Boolean,
          description:
            "Whether to delete child channel if its owner left it, even if it's not empty (default: false)",
        },
        {
          name: "member-limit",
          type: ApplicationCommandOptionType.Integer,
          description: "Child channel member limit (default: 4)",
          minValue: 1,
          maxValue: 99,
        },
        {
          name: "bitrate",
          type: ApplicationCommandOptionType.Integer,
          description: "Child channel bitrate, in bits (default: 64000)",
          minValue: 8000,
          maxValue: 96000,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const channel = interaction.options.getChannel("channel");
    const category = interaction.options.getChannel("category");
    const deleteIfEmpty =
      interaction.options.getBoolean("delete-if-empty") ?? true;
    const deleteIfNoOwner =
      interaction.options.getBoolean("delete-if-no-owner") ?? false;
    const memberLimit = interaction.options.getInteger("member-limit") ?? 4;
    const bitrate = interaction.options.getInteger("bitrate") ?? 64000;

    const dbChannel = await this.client.tempvoices.find(channel.id);

    if(!dbChannel) { 
      return interaction.followUp({
        content: this.client.reply(
          l("commands:opts:tempvoice:create:already_trigger", { channel: `${channel}` }),
          ":white_check_mark:"
        ),
      });
    }


    await this.client.tempvoices.create({
      guild_id: interaction.guild.id,
      channel_id: channel.id,
      options: {
        category_id: category.id,
        delete_if_empty: deleteIfEmpty,
        delete_if_no_owner: deleteIfNoOwner,
        member_limit: memberLimit,
        bitrate: bitrate,
      },
    });

    await interaction.followUp({
      content: this.client.reply(
        l("commands:opts:tempvoice:create:created", { channel: `${channel}` }),
        ":white_check_mark:"
      ),
    });
  }
}
