import fetch from "node-fetch";
import { isSpotifyURL, isYoutubeURL } from "./utils.js";

export const fetchSongLink = async (url) => {
  return await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=RU&key=${process.env.SONGLINK_KEY}`
  ).then((res) => res.json());
};

export const parseSongLinkData = (data, target_platform) => {
  if (data.linksByPlatform[target_platform] == undefined) {
    const err = new Error("the video is not available on the platform")
    err.name = target_platform == "spotify" ? "Spotify" : "Youtube"
    
    throw err
  }

  const { url, entityUniqueId: unique_id } =
    data.linksByPlatform[target_platform];
  const { title, thumbnailUrl: thumb_url } = data.entitiesByUniqueId[unique_id];

  return { title, url, thumb_url };
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
