import type { Player } from '../types'

/**
 * Filters players by a search query.
 * - Digits only: jersey number prefix match ("1" matches 1, 10-19, ...)
 * - Otherwise: case-insensitive partial name match
 */
export function searchPlayers(players: readonly Player[], query: string): Player[] {
  const q = query.trim().toLowerCase()
  if (q === '') return [...players]

  if (/^\d+$/.test(q)) {
    return players.filter((player) => String(player.jersey).startsWith(q))
  }
  return players.filter((player) => player.name.toLowerCase().includes(q))
}
