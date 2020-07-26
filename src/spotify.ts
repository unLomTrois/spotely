import Base64 from 'js-base64';
import fetch from 'node-fetch';
import spotifyURI from 'spotify-uri';

class SpotifyWrapper {
  private client_id: string;
  private client_secret: string;
  private basic_auth: string;

  private access_token: string | undefined;
  private expires_time: number | undefined;

  constructor(client_id: string, client_secret: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.basic_auth = Base64.encode(this.client_id + ':' + this.client_secret);
  }

  public getAuth = async (): Promise<string> => {
    // check on expire, if not, return old token
    if (this.expires_time !== undefined && this.access_token !== undefined) {
      if (new Date().getTime() < this.expires_time) {
        return this.access_token;
      }
    }

    const auth_token = await this.makeNewAuthFetch();
    this.expires_time = new Date().getTime() + auth_token.expires_in;
    this.access_token = auth_token.access_token;

    return auth_token.access_token;
  };

  private getTrackID = (link: string): string => {
    const parsed = spotifyURI.parse(link);

    return parsed.toURI().split(':')[2];
  };

  /**
   * @todo make typings
   */
  public getTrack = async (link: string): Promise<any> => {
    const track_id = this.getTrackID(link);

    const data: Promise<any> = fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token ?? (await this.getAuth())}`
      }
    }).then((response) => response.json());

    return data;
  };

  private makeNewAuthFetch = async (): Promise<any> => {
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

export { SpotifyWrapper };
