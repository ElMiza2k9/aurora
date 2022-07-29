import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";
import { InteractionHandler } from "../handlers/InteractionHandler";
import { ActivityType } from "discord.js";

export default class ReadyEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "ready", true);
  }

  async execute(client: AuroraClient) {
    client.user.setPresence({
      activities: [{ name: "loading..." }],
      status: "dnd",
    });

    await new InteractionHandler(client).loadInteractions();

    console.log(
      `Ready! Logged in as ${client.user.tag} (id ${client.user.id})`
    );

    client.user.setPresence({
      activities: [
        { name: `v${client.package.version}`, type: ActivityType.Listening },
      ],
      status: "online",
    });
  }
}
