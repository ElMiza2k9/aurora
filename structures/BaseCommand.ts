import * as DJS from "discord.js";
import { AuroraClient } from "./AuroraClient";

export interface BaseCommandOptions {
  name: string;
  description: string;
  options?: DJS.ApplicationCommandOptionData[];
}

export abstract class BaseCommand<
  TOptions extends BaseCommandOptions = BaseCommandOptions
> {
  protected _options: TOptions;
  client: AuroraClient;
  name: string;

  constructor(client: AuroraClient, options: TOptions) {
    this.client = client;
    this.name = options.name;
    this._options = options;

    this.execute = this.execute.bind(this);
  }

  get options(): TOptions {
    return this._options;
  }

  abstract execute(
    interaction: DJS.CommandInteraction,
    locale: any
  ): Promise<unknown>;
}
