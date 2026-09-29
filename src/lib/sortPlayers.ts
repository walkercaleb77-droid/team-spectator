import { POSITIONS, type Player, type SortDirection, type SortKey } from '../types'

const positionRank = new Map(POSITIONS.map((position, index) => [position, index]))

function compareBy(key: SortKey, a: Player, b: Player): number {
  switch (key) {
    case 'jersey':
      return a.jersey - b.jersey
    case 'name':
      return a.name.localeCompare(b.name)
    case 'position':
      // Custom football order (QB, RB, WR, ...), not alphabetical.
      // Ties fall back to jersey number so the order is stable and predictable.
      return (positionRank.get(a.position) ?? 0) - (positionRank.get(b.position) ?? 0) || a.jersey - b.jersey
  }
}

/** Returns a new sorted array; does not mutate the input. */
export function sortPlayers(players: readonly Player[], key: SortKey, direction: SortDirection): Player[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...players].sort((a, b) => sign * compareBy(key, a, b))
}
