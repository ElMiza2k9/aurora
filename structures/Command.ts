import * as DJS from "discord.js";
import { AuroraClient } from "./AuroraClient";

export interface CommandOptions {
  name: string;
  description: string;
  client_perms?: Array<DJS.PermissionsString>;
  user_perms?: Array<DJS.PermissionsString>;
  options?: DJS.ApplicationCommandOptionData[];
}

export abstract class Command<
  TOptions extends CommandOptions = CommandOptions
> {
  protected _options: TOptions;
  name: string;
  client_perms?: Array<DJS.PermissionsString>;
  user_perms?: Array<DJS.PermissionsString>;
  client: AuroraClient;

  constructor(client: AuroraClient, options: TOptions) {
    this.client = client;
    this.name = options.name;
    this.client_perms = options.client_perms;
    this.user_perms = options.user_perms;
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
