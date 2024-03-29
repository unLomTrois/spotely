import { isSpotifyURL, isYoutubeURL } from "../src/utils";

describe("link validation", () => {
  describe("youtube validation", () => {
    test("basic youtube link", () => {
      expect(
        isYoutubeURL("https://youtube.com/watch?v=xUNqsfFUwhY&feature=share")
      ).toBe(true);
    });

    test("no substrings", () => {
      expect(
        isYoutubeURL("https://redirect.to/site=https://youtube.com/watch?v=xUNqsfFUwhY&feature=share")
      ).toBe(false);
    });

    test("youtube link must have watch query with v param", () => {
      expect(isYoutubeURL("https://youtube.com/")).toBe(false);
    });

    test("youtube link must have video id after v param", () => {
      expect(isYoutubeURL("https://youtube.com/watch?v=")).toBe(false);
      expect(isYoutubeURL("https://youtube.com/watch?v=xUNqsfFUwhY")).toBe(
        true
      );
    });

    test("basic youtu.be link", () => {
      expect(isYoutubeURL("https://youtu.be/xUNqsfFUwhY")).toBe(true);
    });

    test("youtu.be must have video id", () => {
      expect(isYoutubeURL("https://youtu.be/")).toBe(false);
    });

    test("basic youtube music link", () => {
      expect(
        isYoutubeURL(
          "https://music.youtube.com/watch?v=xUNqsfFUwhY&feature=share"
        )
      ).toBe(true);
    });

    test("youtube music must have watch query with v param", () => {
      expect(isYoutubeURL("https://music.youtube.com/")).toBe(false);
    });

    test("youtube music must have video id after v param", () => {
      expect(isYoutubeURL("https://music.youtube.com/watch?v=")).toBe(false);
      expect(
        isYoutubeURL("https://music.youtube.com/watch?v=xUNqsfFUwhY")
      ).toBe(true);
    });
  });

  describe("spotify validation", () => {
    test("spotify url validation", () => {
      expect(
        isSpotifyURL("https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2")
      ).toBe(true);
    });

    test("no substrings", () => {
      expect(
        isYoutubeURL("https://redirect.to/site=https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2")
      ).toBe(false);
    });

    test("spotify link must have track with track id", () => {
      expect(isSpotifyURL("https://open.spotify.com/")).toBe(false);
      expect(isSpotifyURL("https://open.spotify.com/track/")).toBe(false);
    });
  });
});
