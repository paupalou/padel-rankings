export type Data<T> = {
  data: T;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
};

export type Player = {
  id: string;
  name: string;
  avatar?: string;
};

export type Ranking = {
  id: string;
  name: string;
  creator: User;
  createdAt: Date;
};

export type Team = [string, string];
export type SetScore = [number, number];

export type Game = {
  id: string;
  ranking: string;
  team1: Team;
  team2: Team;
  set1: SetScore;
  set2: SetScore;
  set3?: SetScore;
  field: string;
  playedAt: Date;
  createdAt: Date;
};

type UserType = {
  admin: boolean;
};

export type GoogleUserInfo = {
  id: string;
  verified_email: boolean;
  email: string;
  picture: string;
} & UserType;

export type ParsedGame = Omit<Game, "team1" | "team2"> & {
  team1: [Player, Player];
  team2: [Player, Player];
};

export type PlayerPoints = {
  id: string;
  name: string;
  points: number;
  score: number;
  matches: number;
  wins: number;
  loses: number;
  average: number;
  winratio: number;
  games: ParsedGame[];
};

export type DatabaseMigration = {
  createdAt: Date;
  fileName: string;
};
