import Telegraf from "telegraf";
import isUrl from "is-url";

import { spotify } from "./spotify.js";
import { youtube } from "./youtube.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.use(async (_, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log("Response time: %sms", ms);
});

bot.start((ctx) => {
  ctx.reply("Spotify-link to Youtube-link conversion bot.");
});
bot.help((ctx) =>
  ctx.reply("Write /search <spotify-link> and get youtube-link")
);

bot.on("text", async (ctx) => {
  const url = ctx.message?.text;

  if (url !== undefined) {
    if (!isUrl(url)) {
      ctx.reply("not a link");
      return;
    }

    if (url.includes("https://open.spotify.com/track/")) {
      const track_data = await spotify.getTrack(url);

      console.log(track_data);

      const query = track_data.artists[0].name + " " + track_data.name;

      const video = await youtube.getVideoLink(query).catch((err) => {
        console.error(err);
      });

      ctx.reply(video || 'not found');
    }
  } else {
    ctx.reply("no link provided");
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
