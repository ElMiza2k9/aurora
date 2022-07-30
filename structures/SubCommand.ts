import { BaseCommand, BaseCommandOptions } from "./BaseCommand";
import * as DJS from "discord.js";

export interface SubCommandOptions extends BaseCommandOptions {
  topName: string;
  groupName?: string;
}

export abstract class SubCommand extends BaseCommand<SubCommandOptions> {
  get options(): SubCommandOptions & {
    type: DJS.ApplicationCommandOptionType.Subcommand;
  } {
    return {
      type: DJS.ApplicationCommandOptionType.Subcommand,
      ...this._options,
    };
  }
}
