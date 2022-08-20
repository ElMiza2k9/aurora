import * as DJS from "discord.js";
import i18next from "i18next";
import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class InteractionCreateEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "interactionCreate");
  }

  async execute(client: AuroraClient, interaction: DJS.Interaction) {
    if (!interaction) return;
    if (interaction.type !== DJS.InteractionType.ApplicationCommand) return;
    if (interaction.commandType !== DJS.ApplicationCommandType.ChatInput)
      return;
    if (!interaction.inGuild()) return;

    const command = client.interactions.get(this.getCommand(interaction));
    if (!command) return;

    const dbGuild = await client.functions.getGuild(interaction.guild?.id);
    const dbUser = await client.functions.getUser(
      interaction.user?.id,
      interaction.guild?.id
    );
    let locale = (global.l = i18next.getFixedT(
      dbUser?.locale ?? `${dbGuild?.locale || "en-US"}`
    ));

    try {
      await command.execute(interaction, locale);
    } catch (error) {
      await interaction.followUp({
        content: client.functions.reply(
          locale("misc:error", { error: `${error.name}` }),
          ":x:"
        ),
        ephemeral: true,
      });
      console.log(`[error] ${error?.stack}`);
    }
  }

  getCommand(interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">) {
    let command: string;

    const commandName = interaction.commandName;
    const group = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);

    if (subCommand) {
      if (group) {
        command = `${commandName}-${group}-${subCommand}`;
      } else {
        command = `${commandName}-${subCommand}`;
      }
    } else {
      command = commandName;
    }

    return command;
  }
}
