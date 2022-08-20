import { Command, CommandOptions } from "./Command";
import * as DJS from "discord.js";

export interface SubCommandOptions extends CommandOptions {
  topName: string;
  groupName?: string;
}

export abstract class SubCommand extends Command<SubCommandOptions> {
  get options(): SubCommandOptions & {
    type: DJS.ApplicationCommandOptionType.Subcommand;
  } {
    return {
      type: DJS.ApplicationCommandOptionType.Subcommand,
      ...this._options,
    };
  }
}
