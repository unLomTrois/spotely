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

  let res;

  try {
    res = await convertURL(url);
  } catch (err) {
    console.error(err);
  }

  await ctx.reply(res || "Ничего не найдено 😓");
});

bot.on(
  "inline_query",
  async ({ inlineQuery: { query }, answerInlineQuery }) => {
    if (isUrl(query) && (isYoutubeURL(query) || isSpotifyURL(query))) {
      let res;

      try {
        res = await convertURL(query);
      } catch (err) {
        console.error(err);

        let err_message;
        if (err.message == "the video is not available on the platform")
          err_message = `Видео не было найдено на платформе ${err.name}`;

        return await answerInlineQuery(
          [
            {
              id: 0,
              type: "article",
              title: "Ничего не найдено",
              description: err_message || "Неизвестная ошибка",
              input_message_content: {
                message_text: `По запросу ${query} ничего не найдено`,
              },
            },
          ],
          { cache_time: 3600 }
        );
      }

      const { title, url, thumb_url } = res;

      return await answerInlineQuery(
        [
          {
            id: 0,
            type: "video",
            mime_type: "video/mp4",
            title,
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
