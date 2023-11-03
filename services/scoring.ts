import { Game, Player, PlayerPoints, SetScore, Team } from "types";

const rules = {
  // scoring
  set_value: 5,
  game_difference_value: 1,
};

export function initPlayerPoints(
  players: Player[],
): Record<string, PlayerPoints> {
  return players.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: {
        name: curr.name,
        points: 0,
        matches: 0,
        wins: 0,
        loses: 0,
        average: 0,
        games: [],
      },
    };
  }, {});
}

function assignSetPoints({ playerPoints, set, teams }: {
  playerPoints: Record<string, PlayerPoints>;
  set: SetScore;
  teams: Team[];
}) {
  const [team1, team2] = teams;
  const [team1_score, team2_score] = set;

  const gameDifference = team1_score - team2_score;
  const team1_won_set = gameDifference > 0;
  const team2_won_set = gameDifference < 0;

  if (team1_won_set) {
    for (const player of team1) {
      playerPoints[player.id].points += rules.set_value + (gameDifference - 2);
    }
    return 1;
  } else if (team2_won_set) {
    for (const player of team2) {
      playerPoints[player.id].points += rules.set_value +
        Math.abs(gameDifference) - 2;
    }
    return 2;
  }
}

export function getRanking(
  games: Game[],
  playerPoints: Record<string, PlayerPoints>,
) {
  games.forEach((game) => {
    const teams = [game.team1, game.team2];

    const set1_winner = assignSetPoints({
      set: game.set1,
      playerPoints,
      teams,
    });
    const set2_winner = assignSetPoints({
      set: game.set2,
      playerPoints,
      teams,
    });
    let gameWinner;

    if (set1_winner === set2_winner) {
      gameWinner = set1_winner;
    } else if (game.set3 && Array.isArray(game.set3)) {
      gameWinner = assignSetPoints({ set: game.set3, playerPoints, teams });
    }

    for (const player of game.team1) {
      playerPoints[player.id].matches += 1;
      playerPoints[player.id].games = [...playerPoints[player.id].games, game];
      if (gameWinner === 1) {
        playerPoints[player.id].wins += 1;
      } else {
        playerPoints[player.id].loses += 1;
      }
    }

    for (const player of game.team2) {
      playerPoints[player.id].matches += 1;
      playerPoints[player.id].games = [...playerPoints[player.id].games, game];
      if (gameWinner === 2) {
        playerPoints[player.id].wins += 1;
      } else {
        playerPoints[player.id].loses += 1;
      }
    }
  });

  const average = Object.keys(playerPoints).map((playerId) => {
    const playerData = playerPoints[playerId];
    const average = Math.round(
      playerData.matches === 0 ? 0 : playerData.points / playerData.matches,
    );

    return {
      ...playerPoints[playerId],
      id: playerId,
      average,
      score: Math.round(
        playerData.points -
          (playerData.loses > 0 ? average * playerData.loses : 0),
      ),
      winratio: playerData.matches === 0
        ? 0
        : Math.round(playerData.wins / playerData.matches * 100),
    };
  });

  return average.sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    } else if (b.score > a.score) {
      return 1;
    }

    if (a.points > b.points) {
      return -1;
    } else if (b.points > a.points) {
      return 1;
    }

    if (a.average > b.average) {
      return -1;
    } else if (b.average > a.average) {
      return 1;
    }

    return 0;
  });
}
