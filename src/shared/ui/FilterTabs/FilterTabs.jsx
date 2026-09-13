import './FilterTabs.css'

export default function FilterTabs({ options, value, onChange, label }) {
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
