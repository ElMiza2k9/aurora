import { AuroraClient } from "../structures/AuroraClient";
import { Event } from "../structures/Event";
import { AuroraInteractionManager } from "../structures/AuroraInteractionManager";
import { ActivityType, PresenceStatusData } from "discord.js";

export default class ReadyEvent extends Event {
  constructor(client: AuroraClient) {
    super(client, "ready", true);
  }

  async execute(client: AuroraClient) {
    client.user.setPresence({
      activities: [{ name: "loading..." }],
      status: "dnd",
    });

    await new AuroraInteractionManager(client).init();

    console.log(
      `Ready! Logged in as ${client.user.tag} (id ${client.user.id})`
    );

    client.user.setPresence({
      activities: [
        {
          name:
            client.config.presence.name.replaceAll(
              "{VERSION}",
              `v${client.package.version}`
            ) ?? `v${client.package.version}`,
          type: client.config.presence.type ?? ActivityType.Listening,
        },
      ],
      status: (client.config.presence.status as PresenceStatusData) ?? "online",
    });
  }
}
