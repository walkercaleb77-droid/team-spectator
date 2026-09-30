/**
 * Converts the roster CSVs into public/roster.json for the app to load.
 *
 * Reads from one roster folder containing:
 *   roster.csv           Varsity/JV (required)
 *   roster-freshman.csv  Freshman (optional; the app shows "not available" without it)
 *
 * If ROSTER_DIR is set, uses that folder and fails if roster.csv is missing
 * (CI uses this when the real roster is switched on). Otherwise uses the first
 * folder that has a roster.csv:
 *   1. ../team-spectator-data  real rosters, in a separate PRIVATE repo
 *   2. data/sample             fake players, committed
 * CI only has the real rosters when the USE_REAL_ROSTER repo variable is "true"
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
import { join } from 'node:path'
import { POSITIONS, type Player, type Position, type Roster } from '../src/types.ts'

const SOURCE_DIRS = ['../team-spectator-data', 'data/sample']
const VARSITY_JV_FILE = 'roster.csv'
const FRESHMAN_FILE = 'roster-freshman.csv'
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

function readRoster(path: string): Player[] {
  try {
    return parseRosterCsv(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`${path}: ${(error as Error).message}`)
  }
}

const override = process.env.ROSTER_DIR
if (override && !existsSync(join(override, VARSITY_JV_FILE))) {
  throw new Error(`ROSTER_DIR is set but ${join(override, VARSITY_JV_FILE)} does not exist`)
}
const dir = override || SOURCE_DIRS.find((path) => existsSync(join(path, VARSITY_JV_FILE)))
if (!dir) throw new Error(`No ${VARSITY_JV_FILE} found. Looked in: ${SOURCE_DIRS.join(', ')}`)

const freshmanPath = join(dir, FRESHMAN_FILE)
const roster: Roster = {
  varsityJv: readRoster(join(dir, VARSITY_JV_FILE)),
  freshman: existsSync(freshmanPath) ? readRoster(freshmanPath) : [],
}
writeFileSync(OUTPUT, JSON.stringify(roster, null, 2) + '\n')
console.log(
  `build-roster: ${roster.varsityJv.length} varsity/JV + ${roster.freshman.length} freshman from ${dir} -> ${OUTPUT}`,
)
