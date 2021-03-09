export interface IOddSharkGameApiResponse {
  stadium: string;
  event_id: string;
  event_date: string;
  home_team_id: string;
  home_name: string;
  home_abbreviation: string;
  away_team_id: string;
  away_name: string;
  away_abbreviation: string;
  event_status: 'Complete' | string;
  status: 'FINAL' | string;
  away_score: string;
  home_score: string;
  total: string;
  under_price: string;
  over_price: string;
  home_money_line: string;
  away_money_line: string;
  home_spread: string;
  away_spread: string;
  home_spread_price: string;
  away_spread_price: string;
}
