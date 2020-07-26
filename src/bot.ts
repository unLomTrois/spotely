import Telegraf from 'telegraf';

import config from './config/security/token.json';

const bot = new Telegraf(process.env.BOT_TOKEN ?? config.bot_token);

bot.use(async (_, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log('Response time: %sms', ms);
});

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

export { bot };
