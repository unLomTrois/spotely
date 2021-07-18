import fetch from "node-fetch";

export const isSpotifyURL = (url) => {
  const spotify_link_regex = new RegExp(
    /(?:http?s?:\/\/)?(?:www.)?open.spotify.com\/(track)\/[a-zA-Z0-9]+(\/playlist\/[a-zA-Z0-9]+|)/y
  );
  return spotify_link_regex.test(url);
};

export const isYoutubeURL = (url) => {
  const youtube_link_regex = new RegExp(
    /(?:http?s?:\/\/)?(?:www.)?(?:m.)?(?:music.)?youtu(?:\.?be)(?:\.com)?(?:(?:\w*.?:\/\/)?\w*.?\w*-?.?\w*\/(?:embed|e|v|watch|.*\/)?\??(?:feature=\w*\.?\w*)?&?(?:v=)?\/?)([\w\d_-]{11})(?:\S+)?/y
  );
  return youtube_link_regex.test(url);
};

export const fetchSongLink = async (url) => {
  return await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=EN&key=${process.env.SONGLINK_KEY}`
  ).then((res) => res.json());
};

export const parseSongLinkData = async (data, target_platform) => {
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
