import type { SortDirection, SortKey } from '../types'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'jersey', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
]

interface SortControlProps {
  sortKey: SortKey
  direction: SortDirection
  onChange: (key: SortKey) => void
}

export function SortControl({ sortKey, direction, onChange }: SortControlProps) {
  return (
    <div className="sort-control" role="group" aria-label="Sort players">
      {SORT_OPTIONS.map(({ key, label }) => {
        const active = key === sortKey
        return (
          <button
            key={key}
            type="button"
            className={active ? 'sort-button active' : 'sort-button'}
            aria-pressed={active}
            onClick={() => onChange(key)}
          >
            {label}
            {active && (
              <span aria-label={direction === 'asc' ? ', ascending' : ', descending'}>
                {direction === 'asc' ? ' ▲' : ' ▼'}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
