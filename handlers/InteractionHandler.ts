import glob from "glob";
import { resolveFile, validateFile } from "../structures/HandlerFunctions";
import { AuroraClient } from "../structures/AuroraClient";
import { Command } from "../structures/Command";
import { ApplicationCommandData, ApplicationCommandType } from "discord.js";

export class InteractionHandler {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;

    this.createCommand = this.createCommand.bind(this);
  }

  async init() {
    const files = glob.sync("./interactions/*.ts");

    for (const file of files) {
      delete require.cache[file];

      const interaction = await resolveFile<Command>(file, this.client);
      if (!interaction) continue;
      await validateFile(file, interaction);

      const data: ApplicationCommandData = {
        type: ApplicationCommandType.ChatInput,
        name: interaction.name,
        description: interaction.options.description ?? "Empty description",
        options: interaction.options.options ?? [],
      };

      await this.createCommand(data);

      this.client.interactions.set(interaction.name, interaction);

      if (this.client.config.debug.handler_logs === true) {
        console.log(`[debug] Loaded command ${interaction.name}`);
      }
    }
  }

  async createCommand(data: ApplicationCommandData) {
    if (
      this.client.config.commands.guild_commands &&
      this.client.config.commands.guild_id
    ) {
      const g = await this.client.guilds.fetch(
        this.client.config.commands.guild_id
      );
      await g.commands.create(data).catch(console.error);
    } else {
      await this.client.application?.commands.create(data);
    }
  }
}
