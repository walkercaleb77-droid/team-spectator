/**
 * Converts the roster CSV into public/roster.json for the app to load.
 *
 * If ROSTER_CSV is set, uses that file and fails if it's missing (CI uses this
 * when the real roster is switched on). Otherwise uses the first roster it finds:
 *   1. ../team-spectator-data/roster.csv  real roster, in a separate PRIVATE repo
 *   2. data/roster.csv                    real roster, local override (gitignored)
 *   3. data/roster.sample.csv             fake players, committed
 * CI only has the real roster when the USE_REAL_ROSTER repo variable is "true"
 * (see .github/workflows/deploy.yml); otherwise the site gets sample data.
 *
 * CSV columns: jersey,first,last,grade,height,weightLb,positions
 *   height: feet-inches, e.g. 6-1
 *   positions: one or more separated by "/", primary first, e.g. RB/DB
 * Fields must not contain commas (no quoted-field support).
 *
 * Run: node scripts/build-roster.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { POSITIONS, type Player, type Position } from '../src/types.ts'

const SOURCES = ['../team-spectator-data/roster.csv', 'data/roster.csv', 'data/roster.sample.csv']
const OUTPUT = 'public/roster.json'
const COLUMNS = ['jersey', 'first', 'last', 'grade', 'height', 'weightLb', 'positions']

function parseInteger(value: string, field: string, line: number): number {
  if (!/^\d+$/.test(value)) throw new Error(`Line ${line}: ${field} must be a whole number, got "${value}"`)
  return Number(value)
}

function parseHeight(value: string, line: number): number {
  const match = /^(\d)-(\d{1,2})$/.exec(value)
  if (!match || Number(match[2]) > 11) throw new Error(`Line ${line}: height must look like 6-1, got "${value}"`)
  return Number(match[1]) * 12 + Number(match[2])
}

function parsePositions(value: string, line: number): Position[] {
  const positions = value.toUpperCase().split('/').map((p) => p.trim())
  for (const position of positions) {
    if (!(POSITIONS as readonly string[]).includes(position)) {
      throw new Error(`Line ${line}: unknown position "${position}" (allowed: ${POSITIONS.join(', ')})`)
    }
  }
  return positions as Position[]
}

function parseRosterCsv(csv: string): Player[] {
  const [header, ...rows] = csv.trim().split(/\r?\n/)
  if (header.trim() !== COLUMNS.join(',')) {
    throw new Error(`Header must be: ${COLUMNS.join(',')}`)
  }

  const seen = new Set<number>()
  return rows
    .map((row, index) => ({ cells: row.split(',').map((cell) => cell.trim()), line: index + 2 }))
    .filter(({ cells }) => cells.some((cell) => cell !== ''))
    .map(({ cells, line }) => {
      if (cells.length !== COLUMNS.length) {
        throw new Error(`Line ${line}: expected ${COLUMNS.length} columns, got ${cells.length}`)
      }
      const [jersey, first, last, grade, height, weightLb, positions] = cells
      const player: Player = {
        jersey: parseInteger(jersey, 'jersey', line),
        firstName: first,
        lastName: last,
        grade: parseInteger(grade, 'grade', line),
        heightIn: parseHeight(height, line),
        weightLb: parseInteger(weightLb, 'weightLb', line),
        positions: parsePositions(positions, line),
      }
      if (seen.has(player.jersey)) throw new Error(`Line ${line}: jersey ${player.jersey} is used twice`)
      seen.add(player.jersey)
      return player
    })
}

const override = process.env.ROSTER_CSV
if (override && !existsSync(override)) throw new Error(`ROSTER_CSV is set but ${override} does not exist`)
const source = override || SOURCES.find((path) => existsSync(path))
if (!source) throw new Error(`No roster found. Looked for: ${SOURCES.join(', ')}`)
const players = parseRosterCsv(readFileSync(source, 'utf8'))
writeFileSync(OUTPUT, JSON.stringify(players, null, 2) + '\n')
console.log(`build-roster: ${players.length} players from ${source} -> ${OUTPUT}`)
