import { ChangeEvent, KeyboardEvent } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import styles from './SearchBox.module.css'

export interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  onSubmit?: () => void
  placeholder?: string
  className?: string
}

export default function SearchBox({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search...',
  className
}: SearchBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className={`${styles.searchBox} ${className ?? ''}`}>
      <FaSearch aria-hidden="true" />
      <input
        type="search"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Search input"
      />
      {onClear && value && (
        <button type="button" aria-label="Clear search" onClick={onClear} className={styles.clearButton}>
          <FaTimes aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
