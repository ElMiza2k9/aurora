import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ChannelCreateCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "hug",
      topName: "roleplay",
      description: "Hug someone!",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "A person you want to hug",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    const user = interaction.options.getUser("user");

    await interaction.deferReply();

    if (
      user.id === interaction.client.user.id ||
      user.id === interaction.user.id
    ) {
      return interaction.followUp({
        content: interaction.client.functions.reply(
          l("commands:roleplay:hug:checks:self"),
          ":angry:"
        ),
      });
    } else if (user.bot) {
      return interaction.followUp({
        content: interaction.client.functions.reply(
          l("commands:roleplay:hug:checks:bot"),
          ":thinking:"
        ),
      });
    } else {
      const gif = await fetch(`https://nekos.life/api/v2/img/hug`).then((res) =>
        res.json()
      );
      interaction.followUp({
        content: interaction.client.functions.reply(
          l("commands:roleplay:hug:reply", {
            user: `${user}`,
            author: `${interaction.user}`,
          }),
          ":hugging:"
        ),
        embeds: [
          interaction.client.functions.embed(interaction).setImage(gif.url),
        ],
      });
    }
  }
}
