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

    await new InteractionHandler(client).init();

    const tempvoices = await this.client.db.tempVoice.findMany();

    tempvoices.forEach((t) => {
      if (!this.client.channels.cache.get(t.channel_id)) return;
      this.client.tempvoice.registerChannel(t.channel_id, {
        childCategory: t.category_id,
        childAutoDeleteIfEmpty: t.delete_if_empty,
        childAutoDeleteIfOwnerLeaves: t.delete_if_no_owner,
        childMaxUsers: t.member_limit,
        childBitrate: t.bitrate,
        childFormat: (member, count) => `#${count} [${member.user.username}]`,
      });
    });

    console.log(`[tempvoices] Registered ${tempvoices.length} tempvoices`);

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
          type: ActivityType.Listening,
        },
      ],
      status: "online",
    });
  }
}
