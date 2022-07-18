import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";
import { InteractionHandler } from "../handlers/InteractionHandler";
import { ActivityType } from "discord.js";

export default class ReadyEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "ready", true);
  }

  async execute(client: AuroraClient) {
    await new InteractionHandler(client).loadInteractions();

    console.log(
      `Ready! Logged in as ${client.user.tag} (id ${client.user.id})`
    );

    client.user.setActivity(`v${client.package.version}`, {
      type: ActivityType.Listening,
    });
  }
}
