import { useSignal } from "@preact/signals";

import { Player } from "types";
import Select from "components/select.tsx";

export default function PlayerSelection(
  { players }: { players: Record<string, Player> },
) {
  const selection = useSignal(["", "", "", ""]);

  const playersById = Object.keys(players);

  const options = {
    team1: {
      player1: playersById.filter((playerId) =>
        !selection.value.slice(1).includes(playerId)
      ),
      player2: playersById.filter((playerId) =>
        selection.value[0] !== playerId && selection.value[2] !== playerId &&
        selection.value[3] !== playerId
      ),
    },

    team2: {
      player1: playersById.filter((playerId) =>
        selection.value[0] !== playerId && selection.value[1] !== playerId &&
        selection.value[3] !== playerId
      ),
      player2: playersById.filter((playerId) =>
        !selection.value.slice(0, -1).includes(playerId)
      ),
    },
  };

  const selectPlayer =
    (playerPosition: [number, number]) => (playerId: string) => {
      const [team, teamPosition] = playerPosition;
      if (team === 1) {
        if (teamPosition === 1) {
          selection.value = [playerId, ...selection.value.slice(1)];
        } else {
          selection.value = [
            selection.value[0],
            playerId,
            ...selection.value.slice(2),
          ];
        }

        return;
      }

      if (teamPosition === 1) {
        selection.value = [
          ...selection.value.slice(0, 2),
          playerId,
          selection.value[3],
        ];
      } else {
        selection.value = [...selection.value.slice(0, 3), playerId];
      }
    };

  return (
    <>
      <div className="flex gap-2">
        <span>Team 1</span>
        <Select
          name="team1player1"
          options={playersById.map((playerId) => (
            <option
              disabled={!options.team1.player1.includes(playerId)}
              value={playerId}
            >
              {players[playerId].name}
            </option>
          ))}
          onChange={(e) => selectPlayer([1, 1])(e.target.value)}
        />
        <Select
          name="team1player2"
          options={playersById.map((playerId) => (
            <option
              disabled={!options.team1.player2.includes(playerId)}
              value={playerId}
            >
              {players[playerId].name}
            </option>
          ))}
          onChange={(e) => selectPlayer([1, 2])(e.target.value)}
        />
      </div>

      <div className="flex gap-2" placeholder="select player">
        <span>Team2</span>
        <Select
          name="team2player1"
          options={playersById.map((playerId) => (
            <option
              disabled={!options.team2.player1.includes(playerId)}
              value={playerId}
            >
              {players[playerId].name}
            </option>
          ))}
          onChange={(e) => selectPlayer([2, 1])(e.target.value)}
        />
        <Select
          name="team2player2"
          options={playersById.map((playerId) => (
            <option
              disabled={!options.team2.player2.includes(playerId)}
              value={playerId}
            >
              {players[playerId].name}
            </option>
          ))}
          onChange={(e) => selectPlayer([2, 2])(e.target.value)}
        />
      </div>
    </>
  );
}
