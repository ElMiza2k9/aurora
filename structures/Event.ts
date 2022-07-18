import { AuroraClient } from "./AuroraClient";

export abstract class Event {
  client: AuroraClient;
  name: string;
  once: boolean;
  player: boolean;

  constructor(
    client: AuroraClient,
    name: string,
    once = false,
    player = false
  ) {
    this.client = client;
    this.name = name;
    this.once = once;
    this.player = player;

    this.execute = this.execute.bind(this);
  }

  /**
   * @param {AuroraClient} client
   */
  abstract execute(client: AuroraClient, ...args: any[]): Promise<any>;
}
