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

export const fetchSongLink = async (url) => {
  return await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=EN&key=${process.env.SONGLINK_KEY}`
  ).then((res) => res.json());
};

export const parseSongLinkData = async (data, target_platform) => {
  const unique_id = data.linksByPlatform[target_platform].entityUniqueId;
  const { title, thumbnailUrl: thumb_url } = data.entitiesByUniqueId[unique_id];
  const url = data.linksByPlatform.youtube.url;

  return { title, thumb_url, url };
};

export const convertURL = async (url) => {
  const data = await fetchSongLink(url);

  let target_platform;

  if (isSpotifyURL(url)) {
    target_platform = "youtube";
  } else if (isYoutubeURL(url)) {
    target_platform = "spotify";
  }

  return parseSongLinkData(data, target_platform);
};
