import * as DJS from "discord.js";

export const AuroraClientOptions: DJS.ClientOptions = {
  intents: [
    DJS.GatewayIntentBits.Guilds,
    DJS.GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [DJS.Partials.GuildMember, DJS.Partials.User, DJS.Partials.Channel],
  allowedMentions: { parse: ["roles", "users"] },
};
