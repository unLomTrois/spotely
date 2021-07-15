import fetch from "node-fetch";

export const isSpotifyURL = (url) => {
  return url.includes("https://open.spotify.com/track/");
};

export const isYoutubeURL = (url) => {
  return (
    url.includes("youtube.com/watch") ||
    url.includes("youtu.be/") ||
    url.includes("music.youtube.com/watch")
  );
};

export const convertURL = async (url) => {
  if (isSpotifyURL(url)) {
    const youtube_url = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=EN`
    )
      .then((res) => res.json())
      .then((res) => res.linksByPlatform.youtube?.url);

    return youtube_url;
  } else if (isYoutubeURL(url)) {
    const spotify_url = await fetch(
      `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=EN`
    )
      .then((res) => res.json())
      .then((res) => res.linksByPlatform.spotify?.url);

    return spotify_url;
  }
};
