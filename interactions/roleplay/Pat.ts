import { ApplicationCommandOptionType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class RoleplayPatCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "pat",
      topName: "roleplay",
      description: "Pat someone!",
      options: [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "A person you want to pat",
          required: true,
        },
      ],
    });
  }
  async execute(interaction, l) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");

    if (user.id === this.client.user.id || user.id === interaction.user.id) {
      return interaction.followUp({
        content: this.client.reply(
          l("commands:roleplay:pat:checks:self"),
          ":face_with_raised_eyebrow:"
        ),
      });
    } else {
      const gif = await fetch(`https://nekos.life/api/v2/img/pat`).then((res) =>
        res.json()
      );
      await interaction.followUp({
        content: this.client.reply(
          l("commands:roleplay:pat:reply", {
            user: `${user}`,
            author: `${interaction.user}`,
          }),
          ":hugging:"
        ),
        embeds: [this.client.embed(interaction).setImage(gif.url)],
      });
    }
  }
}
