import fetch from "node-fetch";

class YoutubeWrapper {
  category = 10; // music category

  constructor(google_api_key) {
    this.key = google_api_key;
  }

  getVideoLink = async (query) => {
    const link = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=${this.category}&maxResults=10&q=${query}&type=video&key=${this.key}`;

    return fetch(encodeURI(link))
      .then((res) => res.json())
      .then((list) => {
        // const newlist = [];

        // list.items.forEach((element) => {
        //   newlist.push({
        //     url: this.buildLink(element.id.videoId),
        //     title: element.snippet.title,
        //     description: element.snippet.description,
        //     thumbnail_url: element.snippet.thumbnails.default.url
        //   });

        //   console.log({
        //     url: this.buildLink(element.id.videoId),
        //     title: element.snippet.title,
        //     description: element.snippet.description,
        //     thumbnail_url: element.snippet.thumbnails.default.url
        //   })
        // });

        return list.items[0];
      })
      .then((item) => item.id.videoId)
      .then((videoId) => this.buildLink(videoId));
  };

  buildLink = (videoId) => `https://youtu.be/${videoId}`;
}

const youtube = new YoutubeWrapper(process.env.GOOGLE_API_KEY);

export { youtube };
