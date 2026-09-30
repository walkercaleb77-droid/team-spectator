export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P'] as const

export type Position = (typeof POSITIONS)[number]

export interface Player {
  jersey: number
  firstName: string
  lastName: string
  grade: number
  heightIn: number
  weightLb: number
  /** Primary position first, e.g. ["RB", "DB"] */
  positions: Position[]
}

export type SortKey = 'jersey' | 'name' | 'position' | 'height' | 'weight'
export type SortDirection = 'asc' | 'desc'
