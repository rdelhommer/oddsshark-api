import { IOddSharkGameApiResponse } from "../interfaces";

export interface IGame {
  stadium: string;
  eventId: string;
  eventDate: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamAbbreviation: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamAbbreviation: string;
  eventStatus: 'Complete' | string;
  status: 'FINAL' | string;
  awayScore: number;
  homeScore: number;
  total: number;
  underPrice: number;
  overPrice: number;
  homeMoneyLine: number;
  awayMoneyLine: number;
  homeSpread: number;
  awaySpread: number;
  homeSpreadPrice: number;
  awaySpreadPrice: number;
}

export function mapResponseToGame(response: IOddSharkGameApiResponse): IGame {
  return {
    stadium: response.stadium,
    eventId: response.event_id,
    eventDate: response.event_date,
    homeTeamId: response.home_team_id,
    homeTeamName: response.home_name,
    homeTeamAbbreviation: response.home_abbreviation,
    awayTeamId: response.away_team_id,
    awayTeamName: response.away_name,
    awayTeamAbbreviation: response.away_abbreviation,
    eventStatus: response.event_status,
    status: response.status,
    awayScore: Number(response.away_score),
    homeScore: Number(response.home_score),
    total: Number(response.total),
    underPrice: Number(response.under_price),
    overPrice: Number(response.over_price),
    homeMoneyLine: Number(response.home_money_line),
    awayMoneyLine: Number(response.away_money_line),
    homeSpread: Number(response.home_spread),
    awaySpread: Number(response.away_spread),
    homeSpreadPrice: Number(response.home_spread_price),
    awaySpreadPrice: Number(response.away_spread_price)
  }
}
