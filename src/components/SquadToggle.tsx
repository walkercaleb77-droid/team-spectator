import { SQUAD_LABELS, type Squad } from '../types'

interface SquadToggleProps {
  squad: Squad
  onChange: (squad: Squad) => void
}

export function SquadToggle({ squad, onChange }: SquadToggleProps) {
  return (
    <div className="squad-toggle" role="group" aria-label="Choose roster">
      {(Object.keys(SQUAD_LABELS) as Squad[]).map((key) => (
        <button
          key={key}
          type="button"
          className={key === squad ? 'squad-button active' : 'squad-button'}
          aria-pressed={key === squad}
          onClick={() => onChange(key)}
        >
          {SQUAD_LABELS[key]}
        </button>
      ))}
    </div>
  )
}
