import {
  ApplicationCommandOptionType,
  escapeMarkdown,
  PermissionFlagsBits,
} from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ModerationBanCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "ban",
      topName: "moderation",
      description: "Bans a user from this server.",
      client_perms: [PermissionFlagsBits.BanMembers],
      user_perms: [PermissionFlagsBits.BanMembers],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "The user who you want to ban",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "Ban reason",
          min_length: 1,
          max_length: 453,
          required: false,
        },
      ],
    });
  }
  async execute(interaction, _l) {
    await interaction.deferReply();
    const user = await interaction.options.getUser("user");
    const reason = await interaction.options.getString("reason");
    const guildMember = await interaction.guild.members.cache.get(user.id);

    const l = await this.client.locales.getLocale(
      interaction.guild.id,
      user.id
    );

    if (guildMember && !guildMember.bannable) {
      return interaction.followUp({
        content: l("commands:moderation:ban:not_bannable"),
      });
    }

    if (
      interaction.guild.members.me.roles.highest.rawPosition <
      guildMember?.roles.highest.rawPosition
    ) {
      return interaction.followUp({
        content: l("misc:moderation:need_higher_role"),
      });
    }

    if (guildMember) {
      guildMember.send({
        content: reason
          ? `${l("misc:moderation:banned_dm", {
              guild: `**${escapeMarkdown(interaction.guild.name)}**`,
              reason: `**${escapeMarkdown(reason)}**`,
            })}`
          : `${l("misc:moderation:banned_dm_no_reason", {
              guild: `**${escapeMarkdown(interaction.guild.name)}**`,
            })}`,
      });
      guildMember.ban({
        reason: `${interaction.user.tag}/${interaction.user.id}: ${
          reason ?? l("misc:moderation:no_reason")
        }`,
      });
    } else {
      interaction.guild.bans.create(user.id, {
        reason: `${interaction.user.tag}/${interaction.user.id}: ${
          reason ?? l("misc:moderation:no_reason")
        }`,
      });
    }

    interaction.followUp({
      content: this.client.reply(
        l("commands:moderation:ban:reply", {
          user: `**${escapeMarkdown(user.tag)}**`,
        }),
        ":hammer:"
      ),
    });
  }
}
