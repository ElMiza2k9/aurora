import glob from "glob";
import { resolveFile, validateFile } from "./HandlerFunctions";
import { Command } from "./Command";
import { SubCommand } from "./SubCommand";
import * as DJS from "discord.js";
import { AuroraClient } from "structures/AuroraClient";

export class AuroraInteractionManager {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;
    this.createCommand = this.createCommand.bind(this);
  }

  async init() {
    try {
      const files = process.env.BUILD_PATH
        ? glob.sync("./dist/interactions/**/*.js")
        : glob.sync("./interactions/**/*.ts");

      const subCommands: Record<string, SubCommand[]> = {};
      const commandGroups: Record<string, [string, SubCommand[]]> = {};

      for (const file of files) {
        delete require.cache[file];

        const interaction = await resolveFile<Command | SubCommand>(
          file,
          this.client
        );
        if (!interaction) continue;
        await validateFile(file, interaction);

        let commandName;

        if (interaction instanceof SubCommand) {
          const groupName = interaction.options.groupName;
          const topLevelName = interaction.options.topName;

          if (groupName) {
            const prev = commandGroups[groupName]?.[1] ?? [];

            commandGroups[groupName] = [topLevelName, [...prev, interaction]];
            commandName = `${topLevelName}-${groupName}-${interaction.name}`;
          } else if (topLevelName) {
            const prevSubCommands = subCommands[topLevelName] ?? [];
            subCommands[topLevelName] = [...prevSubCommands, interaction];
            commandName = `${topLevelName}-${interaction.name}`;
          }
        } else {
          commandName = interaction.name;

          const data: DJS.ApplicationCommandData = {
            type: DJS.ApplicationCommandType.ChatInput,
            name: interaction.name,
            description: interaction.options.description ?? "Empty description",
            defaultMemberPermissions: interaction.user_perms,
            options: interaction.options.options ?? [],
          };

          await this.createCommand(data);
        }

        this.client.interactions.set(commandName, interaction);

        if (this.client.config.debug.handler_logs) {
          console.log(`[commands] Loaded command ${commandName}`);
        }
      }

      for (const topLevelName in subCommands) {
        const cmds = subCommands[topLevelName];

        const data: DJS.ApplicationCommandData = {
          type: DJS.ApplicationCommandType.ChatInput,
          name: topLevelName,
          description: `${topLevelName} commands`,
          // @ts-expect-error ignore
          options: cmds.map((v) => v.options),
        };

        await this.createCommand(data);
      }

      const groupCache: any[] = [];

      for (const groupName in commandGroups) {
        const [topLevelName, cmds] = commandGroups[groupName];

        const groupData = {
          type: DJS.ApplicationCommandOptionType.SubcommandGroup,
          name: groupName,
          description: `${groupName} sub commands`,
          defaultMemberPermissions: cmds.map((c) => c.user_perms),
          options: cmds.map((v) => v.options),
        };

        groupCache.push(groupData);

        const data: DJS.ApplicationCommandData = {
          type: DJS.ApplicationCommandType.ChatInput,
          name: topLevelName,
          description: `${topLevelName} commands`,
          options: [...groupCache],
        };

        await this.createCommand(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async createCommand(data: DJS.ApplicationCommandData) {
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
