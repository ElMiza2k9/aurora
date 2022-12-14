import { AuroraClient } from "./AuroraClient";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { readdirSync } from "node:fs";
import { Snowflake } from "discord.js";

export class AuroraLocaleManager {
  client: AuroraClient;

  constructor(client: AuroraClient) {
    this.client = client;
  }

  async init() {
    try {
      await i18next
        .use(
          resourcesToBackend((language, namespace, callback) => {
            import(`../locales/${language}/${namespace}.json`)
              .then((resources) => {
                callback(null, resources);
              })
              .catch((error) => {
                callback(error, null);
              });
          })
        )
        .init({
          ns: ["commands", "misc", "permissions"],
          defaultNS: "commands",
          preload: readdirSync("./locales"),
          fallbackLng: "en-US",
          backend: { loadPath: `../locales/{{lng}}/{{ns}}.json` },
          interpolation: {
            escapeValue: false,
            useRawValueToEscape: true,
          },
          returnEmptyString: false,
          returnObjects: true,
        });
      if (this.client.config.debug.handler_logs) {
        console.log(`[locales] Loaded ${i18next.languages.length} locales`);
      }
    } catch (error) {
      return console.error(`[locales] Error loading locales: ${error}`);
    }
  }

  async getLocale(guild_id: Snowflake) {
    const dbGuild = await this.client.getGuild(guild_id);
    return i18next.getFixedT(dbGuild?.settings.general.locale || "en-US");
  }

  async updateLocale(guild_id: Snowflake, locale: string) {
    await this.client.updateGuild(guild_id, {
      settings: { general: { locale: locale } },
    });
  }
}
