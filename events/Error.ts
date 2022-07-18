import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";

export default class ErrorEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "error");
  }

  async execute(_client: AuroraClient, error: Error) {
    console.log(error);
  }
}
