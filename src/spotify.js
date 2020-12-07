import Base64 from 'js-base64';
import fetch from 'node-fetch';
import spotifyURI from 'spotify-uri';

class SpotifyWrapper {
  constructor(client_id, client_secret) {
    this.client_id = client_id
    this.client_secret = client_secret

    this.basic_auth = Base64.encode(this.client_id + ':' + this.client_secret);
    this.expires_in = undefined;
    this.access_token = undefined

    this.getAuth()
  }

  getTrack = async (link) => {
    const track_id = this.getTrackID(link);

    const track = fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token ?? (await this.getAuth())}`
      }
    }).then((response) => response.json());

    return track;
  };

  getTrackbyName = async (name) => {
    const link = `https://api.spotify.com/v1/search?q=${name}&type=track&limit=1`;

    console.log(link);

    const track = fetch(encodeURI(link), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token ?? (await this.getAuth())}`
      }
    }).then(res => res.json()).then(data => data.tracks.items[0])

    return track;
  }

  getTrackID = (link) => {
    return spotifyURI.parse(link).toURI().split(':')[2];
  };

  getAuth = async () => {
    // check on expire, if not, return old token
    if (this.expires_in !== undefined && this.access_token !== undefined) {
      if (new Date().getTime() < this.expires_in) {
        return this.access_token;
      }
    }

    const auth_token = await this.makeNewAuthFetch();

    this.expires_in = new Date().getTime() + auth_token.expires_in;
    this.access_token = auth_token.access_token;

    return this.access_token;
  };

  makeNewAuthFetch = async () => {
    return fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${this.basic_auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => res.json());
  };
}

const spotify = new SpotifyWrapper(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET)

export { spotify }
