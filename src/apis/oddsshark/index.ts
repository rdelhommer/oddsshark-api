import { RequestWrapper } from '../../libs/request.lib';
import { IOddSharkGameApiResponse } from './interfaces';
import { IGame, mapResponseToGame } from './models/game.model';

const NUM_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export class OddsSharkApi {
  constructor(
    private requestWrapper: RequestWrapper,
  ) { }

  private async wait(timeToWaitMs:number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), timeToWaitMs);
    });
  }

  private async sendRequestGetResponse(url: string, refererLeague: string): Promise<IOddSharkGameApiResponse[]> {
    return new Promise(async (resolve, reject) => {
      let currentTry = 0;
      let cachedError;

      do {
        currentTry++;

        try {
          let response = await this.requestWrapper.sendRequest<IOddSharkGameApiResponse[]>(
            url,
            {
              'Accept': '*/*',
              'Accept-Language': 'en-US,en;q=0.5',
              'Connection': 'keep-alive',
              'Host': 'io.oddsshark.com',
              'Referer': `https://www.oddsshark.com/${refererLeague}/scores`,
              'Origin': 'https://www.oddsshark.com',
              'TE': 'Trailers'
            },
            10000
          );
        
          return resolve(response);
        } catch (error) {
          // Log and Retry
          console.error(error);
          await this.wait(RETRY_DELAY_MS);
        }
      } while(currentTry < NUM_RETRIES)

      reject(cachedError);
    });
  }

  private async listGamesForDate(date: Date, league: 'nba' | 'nhl'): Promise<IGame[]> {
    var isoDateStr = new Date(date).toISOString();
    let url = `https://io.oddsshark.com/scores/${league}/${isoDateStr.substring(0, isoDateStr.indexOf('T'))}`;

    let rawResponse = await this.sendRequestGetResponse(url, league);
    return rawResponse.map(x => mapResponseToGame(x));
  }

  async listNbaGamesForDate(date: Date): Promise<IGame[]> {
    return this.listGamesForDate(date, 'nba');
  }

  async listNhlGamesForDate(date: Date): Promise<IGame[]> {
    return this.listGamesForDate(date, 'nhl');
  }
  async listNflGamesForWeek(week: number, year: number): Promise<IGame[]> {
    let url = `https://io.oddsshark.com/scores/football/nfl/${year}/${week}`;

    let rawResponse = await this.sendRequestGetResponse(url, 'nfl');
    return rawResponse.map(x => mapResponseToGame(x));
  }
}
