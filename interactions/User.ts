import { ApplicationCommandOptionType, UserFlags } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";

export default class UserCommand extends Command {
  constructor(client: AuroraClient) {
    super(client, {
      name: "user",
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
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const guildMember = interaction.guild.members.cache.get(user.id);
    const userFlags = await user.fetchFlags();

    if (userFlags.has(UserFlags.TeamPseudoUser)) {
      return interaction.reply({
        content: interaction.client.functions.formatReply(
          `Some genius at Discord thought that registering teams as pseudo-users would be a good idea.
        Why should we respect their stupid decisions?`,
          interaction.client.config.emoji.cross_mark
        ),
      });
    }

    interaction.reply({
      content: interaction.client.functions.formatReply(
        `Here's some info about **${interaction.client.functions.escapeMd(
          user.tag
        )}**:`,
        interaction.client.config.emojis.check_mark
      ),
      embeds: [
        interaction.client.functions
          .buildEmbed(interaction)
          .setThumbnail(user.avatarURL({}))
          .addFields([
            {
              name: "Common info",
              value: `
**Snowflake:** ${user.id}
**Creation date:** ${interaction.client.functions.formatTime(
                user.createdTimestamp,
                "R"
              )}
        `,
            },
            {
              name: "Server info",
              value: guildMember
                ? `
**Join date:** ${interaction.client.functions.formatTime(
                    guildMember.joinedAt,
                    "R"
                  )}
**Server nickname:** ${
                    guildMember.nickname
                      ? interaction.client.functions.escapeMd(
                          guildMember.nickname
                        )
                      : "No nickname set"
                  }
          `
                : "This user didn't join this server.",
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
