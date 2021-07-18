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

