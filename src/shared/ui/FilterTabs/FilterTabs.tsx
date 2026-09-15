import './FilterTabs.css'

export interface FilterTabOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
  title?: string
}

interface FilterTabsProps<T extends string> {
  options: readonly FilterTabOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
}

export default function FilterTabs<T extends string>({ options, value, onChange, label }: FilterTabsProps<T>) {
  return (
    <div aria-label={label} className="filter-tabs">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={option.value === value ? 'filter-tab filter-tab--active' : 'filter-tab'}
          disabled={option.disabled}
          key={option.value}
          onClick={() => onChange(option.value)}
          title={option.title}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
