import Telegraf from "telegraf";
import isUrl from "is-url";
import { isSpotifyURL, isYoutubeURL } from "./utils.js";
import { convertURL } from "./app.js";

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

bot.on(
  "inline_query",
  async ({ inlineQuery: { query }, answerInlineQuery }) => {
    if (isUrl(query) && (isYoutubeURL(query) || isSpotifyURL(query))) {
      const { title, url, thumb_url } = await convertURL(query);

      return await answerInlineQuery(
        [
          {
            id: 0,
            type: "video",
            mime_type: "video/mp4",
            title,
            // description: "desc",
            video_url: url,
            thumb_url,
            input_message_content: { message_text: url },
          },
        ],
        { cache_time: 3600 }
      );
    }
  }
);

export { bot };
