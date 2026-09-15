import Icon from '../Icon.tsx'
import './SearchField.css'

interface SearchFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function SearchField({ label, value, onChange }: SearchFieldProps) {
  return (
    <label className="search-field">
      <Icon name="search" size={18} />
      <span className="sr-only">{label}</span>
      <input aria-label={label} onChange={(event) => onChange(event.target.value)} placeholder={label} type="search" value={value} />
    </label>
  )
}
