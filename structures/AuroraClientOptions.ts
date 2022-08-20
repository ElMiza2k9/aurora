import { ClientOptions, Partials } from "discord.js";

export const AuroraClientOptions: ClientOptions = {
  intents: ["Guilds", "GuildVoiceStates"],
  partials: [Partials.GuildMember, Partials.User, Partials.Channel],
  allowedMentions: { parse: ["roles", "users"] },
};
