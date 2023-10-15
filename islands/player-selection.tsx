import { useSignal } from "@preact/signals";

import { Player } from "types";
import Select from "components/select.tsx";

export default function PlayerSelection({ players }: { players: Player[] }) {
  const selection = useSignal(["", "", "", ""]);

  const options = {
    team1: {
      player1: players.filter((player) =>
        !selection.value.slice(1).includes(player.id)
      ).map((p) => p.id),
      player2: players.filter((player) =>
        selection.value[0] !== player.id && selection.value[2] !== player.id &&
        selection.value[3] !== player.id
      ).map((p) => p.id),
    },

    team2: {
      player1: players.filter((player) =>
        selection.value[0] !== player.id && selection.value[1] !== player.id &&
        selection.value[3] !== player.id
      ).map((p) => p.id),
      player2: players.filter((player) =>
        !selection.value.slice(0, -1).includes(player.id)
      ).map((p) => p.id),
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
          options={players.map((player) => (
            <option
              disabled={!options.team1.player1.includes(player.id)}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
          onChange={(e) => selectPlayer([1, 1])(e.target.value)}
        />
        <Select
          name="team1player2"
          options={players.map((player) => (
            <option
              disabled={!options.team1.player2.includes(player.id)}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
          onChange={(e) => selectPlayer([1, 2])(e.target.value)}
        />
      </div>

      <div className="flex gap-2" placeholder="select player">
        <span>Team2</span>
        <Select
          name="team2player1"
          options={players.map((player) => (
            <option
              disabled={!options.team2.player1.includes(player.id)}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
          onChange={(e) => selectPlayer([2, 1])(e.target.value)}
        />
        <Select
          name="team2player2"
          options={players.map((player) => (
            <option
              disabled={!options.team2.player2.includes(player.id)}
              value={player.id}
            >
              {player.name}
            </option>
          ))}
          onChange={(e) => selectPlayer([2, 2])(e.target.value)}
        />
      </div>
    </>
  );
}
