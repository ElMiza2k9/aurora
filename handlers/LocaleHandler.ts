import { AuroraClient } from "structures/AuroraClient";
import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { readdirSync } from "node:fs";

export class LocaleHandler {
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
          ns: ["commands", "events", "permissions"],
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
}
