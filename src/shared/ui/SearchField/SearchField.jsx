import Icon from '../Icon.jsx'
import './SearchField.css'

export default function SearchField({ label, value, onChange }) {
  return (
    <label className="search-field">
      <Icon name="search" size={18} />
      <span className="sr-only">{label}</span>
      <input aria-label={label} onChange={(event) => onChange(event.target.value)} placeholder={label} type="search" value={value} />
    </label>
  )
}
