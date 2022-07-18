import { Client, Collection } from "discord.js";
import DistubePlayer from "distube";
import { AuroraClientOptions } from "./AuroraClientOptions";
import { Command } from "./Command";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import * as Config from "../config.json";
import * as Package from "../package.json";
import { Functions } from "./Functions";
import { EventHandler } from "../handlers/EventHandler";

export class AuroraClient extends Client<true> {
  interactions: Collection<string, Command> = new Collection();
  player: DistubePlayer;
  config: typeof Config;
  package: typeof Package;
  functions: Functions;

  constructor() {
    super(AuroraClientOptions);

    this.player = new DistubePlayer(this, {
      nsfw: false,
      plugins: [new YtDlpPlugin(), new SpotifyPlugin(), new SoundCloudPlugin()],
    });

    this.config = Config;
    this.package = Package;
    this.functions = new Functions(this);

    new EventHandler(this).loadEvents();
  }
}
