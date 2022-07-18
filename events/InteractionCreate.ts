import * as DJS from "discord.js";
import { InteractionType } from "discord.js";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class InteractionCreateEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "interactionCreate");
  }

  async execute(client: AuroraClient, interaction: DJS.Interaction) {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.interactions.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: client.functions.formatReply(
          `An unknown ${error.name} error happened while processing your command. Please check the logs for details.`,
          client.config.emojis.cross_mark
        ),
        ephemeral: true,
      });
      console.log(`[error] ${error?.stack}`);
    }
  }
}
