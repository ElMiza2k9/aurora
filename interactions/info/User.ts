import {
  ApplicationCommandOptionType,
  escapeMarkdown,
  UserFlags,
} from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class InfoUserCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "user",
      topName: "info",
      description: "Shows your (or someone else's) profile info.",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "The user whose info you want to get",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const guildMember = interaction.guild.members.cache.get(user.id);
    const userFlags = await user.fetchFlags();

    if (userFlags.has(UserFlags.TeamPseudoUser)) {
      return interaction.followUp({
        content: this.client.reply(l("commands:info:user:pseudo_user"), ":x:"),
      });
    }

    await interaction.followUp({
      content: this.client.reply(
        l("commands:info:user:reply", {
          user: `**${escapeMarkdown(user.tag)}**`,
        }),
        ":bust_in_silhouette:"
      ),
      embeds: [
        (
          await this.client.embed(interaction)
        )
          .setThumbnail(user.avatarURL())
          .addFields([
            {
              name: l("commands:info:user:fields:common_info:name"),
              value: `
${l("commands:info:user:fields:common_info:id", { id: `${user.id}` })}
${l("commands:info:user:fields:common_info:created_at", {
  timestamp: `${this.client.formatTime(user.createdTimestamp, "R")}`,
})}
        `,
            },
            {
              name: l("commands:info:user:fields:server_info:name"),
              value: guildMember
                ? `
${l("commands:info:user:fields:server_info:joined_at", {
  timestamp: `${this.client.formatTime(guildMember.joinedAt, "R")}`,
})}
${l("commands:info:user:fields:server_info:nickname", {
  nickname: `${
    guildMember.nickname
      ? escapeMarkdown(guildMember.nickname)
      : `${l("misc:no_server_nickname")}`
  }`,
})}
          `
                : l("misc:user_not_in_server"),
            },
          ])
          .setImage(
            user.bannerURL({
              size: 2048,
              extension: "png",
            })
          ),
      ],
    });
  }
}
