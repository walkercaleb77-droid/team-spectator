import { useMemo, useState } from 'react'
import { RosterList } from './components/RosterList'
import { SearchBar } from './components/SearchBar'
import { SortControl } from './components/SortControl'
import rosterData from './data/roster.json'
import { searchPlayers } from './lib/searchPlayers'
import { sortPlayers } from './lib/sortPlayers'
import { TEAM } from './team'
import type { Player, SortDirection, SortKey } from './types'

const roster = rosterData as Player[]

function App() {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('jersey')
  const [direction, setDirection] = useState<SortDirection>('asc')

  const players = useMemo(
    () => sortPlayers(searchPlayers(roster, query), sortKey, direction),
    [query, sortKey, direction],
  )

  function handleSortChange(key: SortKey) {
    if (key === sortKey) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setDirection('asc')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <p className="brand-school">{TEAM.school}</p>
          <h1>
            {TEAM.name} <span className="brand-sport">{TEAM.sport}</span>
          </h1>
          <p className="brand-location">{TEAM.location}</p>
        </div>
        <SearchBar value={query} onChange={setQuery} />
        <SortControl sortKey={sortKey} direction={direction} onChange={handleSortChange} />
      </header>
      <main>
        <p className="result-count" aria-live="polite">
          {players.length} of {roster.length} players
        </p>
        <RosterList players={players} />
      </main>
    </div>
  )
}

export default App
