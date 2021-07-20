import fetch from "node-fetch";
import { parseSongLinkData } from "../src/app";

test("check if songlink is available", async () => {
  const url = "https://youtube.com/watch?v=xUNqsfFUwhY&feature=share";

  const res = await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=RU`
  );

  expect(res.ok).toBe(true);
});

test("error handling for songlink parsing", async () => {
  const url = "https://www.youtube.com/watch?v=gfMkiW0ylyo";

  const data = await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=RU`
  ).then((res) => res.json());

  const t = () => {
    parseSongLinkData(data, "spotify")
  }

  expect(t).toThrow(Error);
  expect(t).toThrow("the video is not available on the platform");
});
