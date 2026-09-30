import { formatHeight } from '../lib/formatHeight'
import type { Player } from '../types'

interface RosterListProps {
  players: readonly Player[]
}

export function RosterList({ players }: RosterListProps) {
  if (players.length === 0) {
    return <p className="empty">No players match your search.</p>
  }

  return (
    <ul className="roster-list">
      {players.map((player) => (
        <li key={player.jersey} className="player-card">
          <span className="jersey" aria-label={`Number ${player.jersey}`}>
            {player.jersey}
          </span>
          <span className="player-info">
            <span className="player-name">
              {player.firstName} {player.lastName}
            </span>
            <span className="player-stats">
              {formatHeight(player.heightIn)} · {player.weightLb} lb · Gr {player.grade}
            </span>
          </span>
          <span className="position">{player.positions.join('/')}</span>
        </li>
      ))}
    </ul>
  )
}
