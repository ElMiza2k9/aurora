# Aurora
A custom music bot for [Adwaita Discord server](https://discord.gg/ctKs8WRQR5).

## Disclaimer
We do not provide an invitable instance of Aurora. However, this doesn't mean you can upload the bot to any bot lists, such as top.gg or bots.gg. This bot is intended for self-hosting, only for your server.

## About
Free. Open source. For Discord server owners by a Discord server owner.

We aim to provide server owners with a way to reduce their dependency on third-party bots by creating and open-sourcing bots that are customizable to the core AND are easy to run yourself. This allows server admins to have more granular control over hosting and functionality.

## Installation
1. Make sure you have installed the following software:
    - Node.js v16.9 or higher (`node -v` to check)
    - Git (if cloning a repo via terminal)
    - NPM v7 or higher
2. Clone this repository via `git clone` or download the latest release from the [releases page](https://github.com/chamln/aurora/releases).
    - If you have downloaded the latest release archive, extract its contents to a folder of choice.
3. Create a bot account on Discord Developers portal and grab its token and client ID. Make sure to save this token in a safe place because you'll need to regenerate it in case you lose it.
4. Navigate to the folder where you've unpacked the code and rename `config.example.json` to `config.json`.
5. Fill in your `config.json` file.
    - *Optional: if you want to use guild commands instead of global ones, enable Developer Mode in `User Settings => Advanced`, then right-click the server where you want to use the bot and copy its ID.*
6. Run `npm i` to install all the dependencies.
7. Run `npm run prod` to run the bot.
    - If you're modifying the code (e.g. working on a PR), you may find `npm run dev` more useful.
8. You're awesome!

## Contributing
We strive to provide a quality product; however, nothing is ideal in this world. If you find any bugs or encounter issues, feel free to [open an issue](https://github.com/chamln/aurora/issues). If you found an issue and know how to fix it, or you have implemented a new feature, don't hesitate to [open a pull request](https://github.com/chamln/aurora/pulls) - we'll do our best to quickly review and merge your changes and inform you of problems, if any.

## Releases
See the [releases page](https://github.com/chamln/aurora/releases) for a history of releases and highlights for each release.

## License
[Apache License, version 2.0](./LICENSE).