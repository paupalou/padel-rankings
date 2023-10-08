export type Player = {
  id: string;
  name: string;
  avatar?: string;
};

export type Team = [Player, Player];
export type SetScore = [number, number];

export type Game = {
  id: string;
  team1: Team;
  team2: Team;
  set1: SetScore;
  set2: SetScore;
  set3?: SetScore;
  field: string;
  playedAt: Date;
  createdAt: Date;
};
