export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K', 'P'] as const

export type Position = (typeof POSITIONS)[number]

export interface Player {
  jersey: number
  name: string
  heightIn: number
  weightLb: number
  position: Position
}

export type SortKey = 'jersey' | 'name' | 'position'
export type SortDirection = 'asc' | 'desc'
