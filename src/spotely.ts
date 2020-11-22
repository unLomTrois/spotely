import Telegraf from 'telegraf';
import isUrl from 'is-url';

import { SpotifyWrapper } from './spotify.js';
import { YoutubeWrapper } from './youtube.js';
import { TelegrafContext } from 'telegraf/typings/context';

class Spotely {
  private spotify: SpotifyWrapper;
  private youtube: YoutubeWrapper;
  private bot: Telegraf<TelegrafContext>;

  constructor(
    spotify_client_id: string,
    spotify_client_secret: string,
    youtube_config_key: string,
    telegram_bot_token: string
  ) {
    this.spotify = new SpotifyWrapper(spotify_client_id, spotify_client_secret);
    this.youtube = new YoutubeWrapper(youtube_config_key);
    this.bot = new Telegraf(telegram_bot_token);

    this.bot_init();
  }

  public launch = (): void => {
    this.bot.launch();
  };

  private bot_init = () => {
    this.bot.use(async (_, next) => {
      const start = new Date().getTime();
      await next();
      const ms = new Date().getTime() - start;
      console.log('Response time: %sms', ms);
    });

    this.bot.start((ctx) => {
      ctx.reply('Spotify-link to Youtube-link conversion bot.');
      ctx.reply('Write /search <spotify-link> and get youtube-link');
    });
    this.bot.help((ctx) => ctx.reply('Write /search <spotify-link> and get youtube-link'));

    this.bot.command('/search', async (ctx) => {
      const url: string | undefined = ctx.message?.text?.split(' ')[1];

      if (url !== undefined) {
        if (!isUrl(url)) {
          ctx.reply('not a link');
          return;
        }

        if (!url.includes('https://open.spotify.com/track/')) {
          ctx.reply('not a spotify link');
          return;
        }

        const track_data = await this.spotify.getTrack(url);

        const query: string = track_data.artists[0].name + ' ' + track_data.name;

        const video = await this.youtube.getVideoLink(query).catch((err) => {
          console.error(err);
        });

        ctx.reply(video || 'not found');
      } else {
        ctx.reply('no link provided');
      }
    });
  };
}

export { Spotely };
