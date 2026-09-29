interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="player-search" className="visually-hidden">
        Search players by name or jersey number
      </label>
      <input
        id="player-search"
        type="search"
        placeholder="Search name or #"
        autoComplete="off"
        enterKeyHint="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
