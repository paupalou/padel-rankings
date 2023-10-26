export type Data<T> = {
  data: T;
};

export type Player = {
  id: string;
  name: string;
  avatar?: string;
};

export type Ranking = {
  id: string;
  name: string;
  creator: string;
  players: Player[];
  admins: string[];
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

export type PlayerPoints = {
  name: string;
  points: number;
  score: number;
  games: number;
  wins: number;
  loses: number;
  average: number;
  winratio: number;
};
