
import { OddsSharkApi } from '../src/apis/oddsshark';
import { RequestWrapper } from '../src/libs/request.lib';

var api = new OddsSharkApi(new RequestWrapper());

async function gogo() {
  let nbaGames = await api.listNbaGamesForDate(new Date('2021-03-10'));
  console.log(`${nbaGames[0].homeTeamName} vs ${nbaGames[0].awayTeamName}`);
  console.log(nbaGames[0]);

  let nhlGames = await api.listNhlGamesForDate(new Date('2021-03-10'));
  console.log(`${nhlGames[0].homeTeamName} vs ${nhlGames[0].awayTeamName}`);
  console.log(nhlGames[0]);

  let nflGames = await api.listNflGamesForWeek(4, 2020);
  console.log(`${nflGames[0].homeTeamName} vs ${nflGames[0].awayTeamName}`);
  console.log(nflGames[0]);
}

gogo();
