import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  Guild,
  PermissionFlagsBits,
} from "discord.js";
import DistubePlayer from "distube";
import { AuroraClientOptions } from "./AuroraClientOptions";
import { Command } from "./Command";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import * as Config from "../config.json";
import * as Package from "../package.json";
import { AuroraEventManager } from "./AuroraEventManager";
import { PrismaClient } from "@prisma/client";
import { SubCommand } from "./SubCommand";
import { AuroraLocaleManager } from "./AuroraLocaleManager";
import { AuroraTempManager } from "./AuroraTempManager";
import { EmbedBuilder } from "discord.js";
import { Prisma } from "@prisma/client";

export class AuroraClient extends Client<true> {
  interactions: Collection<string, Command | SubCommand> = new Collection();
  player: DistubePlayer;
  config: typeof Config;
  package: typeof Package;
  db: PrismaClient;
  tempvoices: AuroraTempManager;
  locales: AuroraLocaleManager;

  constructor() {
    super(AuroraClientOptions);

    this.db = new PrismaClient();
    this.player = new DistubePlayer(this, {
      nsfw: false,
      emitNewSongOnly: true,
      plugins: [
        new YtDlpPlugin({ update: true }),
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
      ],
      emitAddSongWhenCreatingQueue: false,
      leaveOnFinish: true,
      joinNewVoiceChannel: false,
    });
    this.config = Config;
    this.package = Package;
    this.tempvoices = new AuroraTempManager(this);
    this.locales = new AuroraLocaleManager(this);
  }

  init() {
    this.locales.init();
    new AuroraEventManager(this).init();

    this.db.$connect();
    this.login(process.env["CLIENT_TOKEN"]);
  }

  /**
   * Returns a pre-formatted embed
   * @param {ChatInputCommandInteraction} interaction Your interaction (aka slash command)
   */
  async embed(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
    if (!interaction) {
      throw Error("Expected interaction to be provided (embed)");
    }

    const dbGuild = await this.getGuild(interaction.guild?.id);

    return new EmbedBuilder().setColor(
      dbGuild?.settings.general.embed_color
        ? `#${dbGuild?.settings.general.embed_color}`
        : "#7289da"
    );
  }

  /**
   * Returns a formatted reply
   * @param {string} replyContent Reply content you would like to format
   * @param {string} emoji Emoji you would like to add
   */
  reply(replyContent: string, emoji: string) {
    return `${emoji} ${replyContent}`;
  }

  async getGuild(guild_id: string | undefined) {
    if (!guild_id) return null;

    try {
      const guild =
        (await this.db.guild.findFirst({
          where: { guild_id: guild_id },
        })) ?? (await this.addGuild(guild_id));

      return guild;
    } catch (error) {
      console.log(error);
    }
  }

  async addGuild(guild_id: string) {
    try {
      const guild = await this.db.guild.create({
        data: {
          guild_id: guild_id,
          settings: {},
        },
      });

      return guild;
    } catch (error) {
      console.log(error);
    }
  }

  async updateGuild(guild_id: string, data: Partial<Prisma.GuildUpdateInput>) {
    try {
      const guild = await this.getGuild(guild_id);

      if (!guild) {
        await this.addGuild(guild_id);
      }

      await this.db.guild.updateMany({
        where: { guild_id: guild_id },
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteGuild(guild_id: string): Promise<void> {
    try {
      await this.db.guild.deleteMany({ where: { guild_id: guild_id } });
    } catch (error) {
      console.log(error);
    }
  }

  async vc(
    interaction: any,
    locale: any,
    checkConnection?: boolean,
    checkQueue?: boolean,
    checkLast?: boolean,
    checkPerms?: boolean
  ) {
    if (!interaction) {
      throw Error("Expected interaction to be provided (vc)");
    }

    if (!interaction.member.voice.channel) {
      return interaction.followUp({
        content: this.reply(locale("misc:voice:not_in_voice"), ":x:"),
      });
    } else if (
      interaction.guild.afkChannel &&
      interaction.member.voice.channel.id === interaction.guild.afkChannel.id
    ) {
      return interaction.followUp({
        content: this.reply(locale("misc:voice:in_afk"), ":x:"),
      });
    } else if (interaction.member.voice.selfDeaf) {
      return interaction.followUp({
        content: this.reply(locale("misc:voice:self_deaf"), ":x:"),
      });
    } else if (interaction.member.voice.serverDeaf) {
      return interaction.followUp({
        content: this.reply(locale("misc:voice:server_deaf"), ":x:"),
      });
    } else if (
      interaction.guild.members.me.voice.channel &&
      interaction.guild.members.me.voice.channel.id !==
        interaction.member.voice.channel.id
    ) {
      return interaction.followUp({
        content: this.reply(locale("misc:voice:not_same_channel"), ":x:"),
      });
    }

    if (checkPerms) {
      if (
        !interaction.member.voice.channel
          .permissionsFor(interaction.guild.members.me)
          .has(PermissionFlagsBits.Connect)
      ) {
        return interaction.followUp({
          content: this.reply(locale("misc:voice:perms:connect"), ":x:"),
        });
      } else if (
        !interaction.member.voice.channel
          .permissionsFor(interaction.guild.members.me)
          .has(PermissionFlagsBits.Speak)
      ) {
        return interaction.followUp({
          content: this.reply(locale("misc:voice:perms:speak"), ":x:"),
        });
      }
    }

    if (checkConnection) {
      const distubeConnection = await this.player.voices.get(
        interaction.guild.id
      );
      const voiceConnection = interaction.guild.members.me.voice;
      if (!distubeConnection && !voiceConnection) {
        return interaction.followUp({
          content: this.reply(locale("misc:voice:no_connection"), ":x:"),
        });
      }
    }

    const queue = await interaction.client.player.queues.get(
      interaction.guild.id
    );

    if (checkQueue) {
      if (!queue) {
        return interaction.followUp({
          content: this.reply(locale("misc:voice:no_queue"), ":x:"),
        });
      }
    }

    if (checkLast) {
      if (!queue || queue.songs.length === 1) {
        return interaction.followUp({
          content: this.reply(
            locale("misc:voice:last_song", { cmd: `\`/music stop\`` }),
            ":x:"
          ),
        });
      }
    }
    return true;
  }

  clientPerms(
    permissions: bigint[],
    interaction: ChatInputCommandInteraction<"cached" | "raw">,
    locale: any
  ) {
    const neededPerms: bigint[] = [];

    permissions.forEach((perm) => {
      if (
        !(interaction.guild as Guild).members
          .resolve(interaction.member as any)
          .permissions.has(perm)
      ) {
        neededPerms.push(perm);
      }
    });
    if (neededPerms.length > 0) {
      return locale("misc:client_need_perms", {
        perms: neededPerms
          .map((p) => {
            const perms: string[] = [];
            Object.keys(PermissionFlagsBits).map((key) => {
              if (PermissionFlagsBits[key] === p) {
                perms.push(`* ${locale(`permissions:${key}`)}`);
              }
            });

            return perms;
          })
          .join("\n"),
      });
    }
  }

  userPerms(
    permissions: bigint[],
    interaction: ChatInputCommandInteraction<"cached" | "raw">,
    locale: any
  ) {
    const neededPerms: bigint[] = [];

    permissions.forEach((perm) => {
      if (
        !(interaction.guild as Guild).members
          .resolve(interaction.member as any)
          .permissions.has(perm)
      ) {
        neededPerms.push(perm);
      }
    });

    if (neededPerms.length > 0) {
      return locale("misc:user_need_perms", {
        perms: neededPerms
          .map((p) => {
            const perms: string[] = [];
            Object.keys(PermissionFlagsBits).map((key) => {
              if (PermissionFlagsBits[key] === p) {
                perms.push(`* ${locale(`permissions:${key}`)}`);
              }
            });

            return perms;
          })
          .join("\n"),
      });
    }
  }
}
