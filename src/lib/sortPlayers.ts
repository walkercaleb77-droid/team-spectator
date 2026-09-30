import { POSITIONS, type Player, type SortDirection, type SortKey } from '../types'

const positionRank = new Map(POSITIONS.map((position, index) => [position, index]))

function compareBy(key: SortKey, a: Player, b: Player): number {
  switch (key) {
    case 'jersey':
      return a.jersey - b.jersey
    case 'name':
      return a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
    case 'position':
      // Custom football order (QB, RB, WR, ...) by primary position, not alphabetical.
      return (positionRank.get(a.positions[0]) ?? 0) - (positionRank.get(b.positions[0]) ?? 0)
    case 'height':
      return a.heightIn - b.heightIn
    case 'weight':
      return a.weightLb - b.weightLb
  }
}

/** Returns a new sorted array; does not mutate the input. Ties fall back to jersey number. */
export function sortPlayers(players: readonly Player[], key: SortKey, direction: SortDirection): Player[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...players].sort((a, b) => sign * compareBy(key, a, b) || a.jersey - b.jersey)
}
