import Telegraf from "telegraf";
import isUrl from "is-url";
import { convertURL, isSpotifyURL, isYoutubeURL } from "./utils.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const start_help_text =
  "🙁 Друг отправил трек со спотифая, но у тебя его нет? Или наоборот?\n" +
  "🦥Лень постоянно копировать название трека и искать его вручную?\n" +
  "😎Просто скинь ссылку на трек, и я найду его за тебя.";

bot.use(async (_, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log("Response time: %sms", ms);
});

bot.start(async (ctx) => {
  await ctx.reply(start_help_text);
});

bot.help((ctx) => ctx.reply(start_help_text));

bot.on("text", async (ctx) => {
  const message = ctx.message?.text;

  console.log(message);

  if (message == undefined) {
    await ctx.reply("Вы отправили не ссылку 😕");
    return;
  }

  if (!isUrl(message)) {
    await ctx.reply("Вы отправили не ссылку 😕");
    return;
  }

  const url = message;

  if (!isYoutubeURL(url) && !isSpotifyURL(url)) {
    await ctx.reply("Отправьте ссылку на spotify, youtube или youtube music");
    return;
  }

  const res = await (await convertURL(url)).url;

  await ctx.reply(res || "Ничего не найдено 😓");
});

// bot.on('inline_query', (ctx) => {
//   const result = []
//   // Explicit usage

//   result.push({
//     type: 'video',
//     id: 0,
//     title: "lol",
//     description: "desc",
//     video_url: "https://youtu.be/Y36b8_WFejI",
//     mime_type: "video/mp4",
//     thumb_url: "https://i.ytimg.com/vi/Y36b8_WFejI/default.jpg",
//     input_message_content: { message_text: "https://youtu.be/Y36b8_WFejI" }
//   })

//   // Using context shortcut
//   ctx.answerInlineQuery(result)
// })

export { bot };
