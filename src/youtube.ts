import fetch from 'node-fetch';

class YoutubeWrapper {
  private category = 10; // music category
  private key: string;

  constructor(google_api_key: string) {
    this.key = google_api_key;
  }

  public getVideoLink = async (query: string): Promise<string> => {
    return fetch(
      `https://www.googleapis.com/youtube/v3/search?part=id&videoCategoryId=${this.category}&maxResults=1&q=${query}&type=video&key=${this.key}`
    )
      .then((res) => res.json())
      .then((list) => list.items[0])
      .then((item) => item.id.videoId)
      .then((id) => `https://youtu.be/${id}`);
  };
}

export { YoutubeWrapper };
