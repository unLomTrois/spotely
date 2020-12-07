import Telegraf from "telegraf";
import isUrl from "is-url";

import { spotify } from "./spotify.js";
import { youtube } from "./youtube.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const start_help_text =
  "🙁 Друг отправил трек со спотифая, но у тебя его нет? Или наоборот?\n🦥Лень постоянно копировать название трека и искать его вручную?\n😎Просто скинь ссылку на трек, и я найду его за тебя.";

bot.use(async (_, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log("Response time: %sms", ms);
});

bot.start((ctx) => {
  ctx.reply(start_help_text);
});
bot.help((ctx) => ctx.reply(start_help_text));

const purify_title = (title) => {
  return title
    .split("-", 2)
    .join("")
    .replace("  ", " ")
    .replace(/ \((.*?)\)/, "")
    .replace(/ \[(.*?)\]/, "");
};

bot.on("text", async (ctx) => {
  const url = ctx.message?.text;

  console.log(ctx.message.from.username, url);

  if (url !== undefined) {
    if (isUrl(url)) {
      if (url.includes("https://open.spotify.com/track/")) {
        const track_data = await spotify.getTrack(url);

        const query = track_data.artists[0].name + " " + track_data.name;

        const video = await youtube.getVideoLink(query).catch((err) => {
          console.error(err);
        });

        ctx.reply(video || "Не найдено 😓");
      }

      if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
        const video_data = await youtube.getVideoInfo(url);

        console.log(video_data);

        if (video_data.snippet.categoryId == 10) {
          const artist_title = video_data.snippet.channelTitle.replace(" - Topic", "")

          const track_title = video_data.snippet.title;

          const track_query = track_title.includes("-")
            ? track_title
            : artist_title + " " + track_title;

          const spotify_track_data = await spotify.getTrackbyName(
            purify_title(track_query)
          );

          console.log(spotify_track_data);

          const link = spotify_track_data.external_urls?.spotify;

          ctx.reply(link || "Не найдено 😓");
        } else {
          ctx.reply(
            "Видео не музыкальной категории, найдите что-нибудь другое 😓"
          );
          return;
        }
      }
    } else {
      ctx.reply("Вы отправили не ссылку 😕");
      return;
    }
  } else {
    ctx.reply("Вы отправили не ссылку 😕");
  }
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
