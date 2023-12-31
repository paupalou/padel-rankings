import { Game, Player, PlayerPoints, SetScore, Team } from "types";

const rules = {
  // scoring
  set_value: 5,
  game_difference_value: 1,
};

export function initPlayerPoints(
  players: Record<string, Player>,
): Record<string, PlayerPoints> {
  return Object.entries(players).reduce((acc, [id, player]) => ({
    ...acc,
    [id]: {
      name: player.name,
      points: 0,
      matches: 0,
      wins: 0,
      loses: 0,
      average: 0,
      games: [],
    },
  }), {});
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
    for (const playerId of team1) {
      playerPoints[playerId].points += rules.set_value + (gameDifference - 2);
    }
    return 1;
  } else if (team2_won_set) {
    for (const playerId of team2) {
      playerPoints[playerId].points += rules.set_value +
        Math.abs(gameDifference) - 2;
    }
    return 2;
  }
}

export function getScoring(
  games: Game[],
  playerPoints: Record<string, PlayerPoints>,
) {
  games.forEach((game) => {
    const teams = [game.team1, game.team2];
    const [team1player1, team1player2] = game.team1;
    const [team2player1, team2player2] = game.team2;

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

    for (const playerId of game.team1) {
      playerPoints[playerId].matches += 1;
      playerPoints[playerId].games = [
        ...playerPoints[playerId].games,
        {
          ...game,
          team1: [
            { id: team1player1, name: playerPoints[team1player1].name },
            { id: team1player2, name: playerPoints[team1player2].name },
          ] as [Player, Player],
          team2: [
            { id: team2player1, name: playerPoints[team2player1].name },
            { id: team2player2, name: playerPoints[team2player2].name },
          ] as [Player, Player],
        },
      ];

      if (gameWinner === 1) {
        playerPoints[playerId].wins += 1;
      } else {
        playerPoints[playerId].loses += 1;
      }
    }

    for (const playerId of game.team2) {
      playerPoints[playerId].matches += 1;
      playerPoints[playerId].games = [...playerPoints[playerId].games, {
        ...game,
        team1: [
          { id: team1player1, name: playerPoints[team1player1].name },
          { id: team1player2, name: playerPoints[team1player2].name },
        ] as [Player, Player],
        team2: [
          { id: team2player1, name: playerPoints[team2player1].name },
          { id: team2player2, name: playerPoints[team2player2].name },
        ] as [Player, Player],
      }];
      if (gameWinner === 2) {
        playerPoints[playerId].wins += 1;
      } else {
        playerPoints[playerId].loses += 1;
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
