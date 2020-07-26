import { Spotely } from './spotely.js';

import telegram_config from './config/security/telegram.json';
import spotify_config from './config/security/spotify.json';
import youtube_config from './config/security/youtube.json';

const bot = new Spotely(
  spotify_config.application.client_id,
  spotify_config.application.client_secret,
  youtube_config.key,
  telegram_config.bot_token
);

bot.launch();
