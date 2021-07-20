import Telegraf from "telegraf";
import session from "telegraf/session.js";

import I18n from "telegraf-i18n";
import path from "path";
import isUrl from "is-url";
import { isSpotifyURL, isYoutubeURL } from "./utils.js";
import { convertURL } from "./app.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const __dirname = path.resolve();

const i18n = new I18n({
  defaultLanguage: "en",
  useSession: true,
  sessionName: "session",
  directory: path.resolve(__dirname, "locales"),
});

bot.use(session());
bot.use(i18n.middleware());

bot.use(async (_, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log("Response time: %sms", ms);
});

bot.start(() => I18n.reply("greeting"));

bot.command("ru", ({ i18n, reply }) => {
  i18n.locale("ru");

  return reply(i18n.t("greeting"));
});

bot.command("en", ({ i18n, reply }) => {
  i18n.locale("en-US");

  return reply(i18n.t("greeting"));
});

bot.help(({ reply, i18n }) => {
  return reply(i18n.t("greeting"));
});

bot.on("text", async ({ reply, i18n, message: { text: message } }) => {
  console.log(message);

  if (message == undefined) {
    return await reply(i18n.t("wrong_link"));
  }

  if (!isUrl(message)) {
    return await reply(i18n.t("wrong_link"));
  }

  const url = message;

  if (!isYoutubeURL(url) && !isSpotifyURL(url)) {
    return await reply(
      "Отправьте ссылку на spotify, youtube или youtube music"
    );
  }

  let res;

  try {
    res = await convertURL(url);
  } catch (err) {
    console.error(err);
  }

  await reply(res?.url || "Ничего не найдено 😓");
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
