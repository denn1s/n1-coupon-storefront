import Select, { StylesConfig, GroupBase, OnChangeValue, ActionMeta } from 'react-select'

export interface SelectOption {
  value: string | number
  label: string
  isDisabled?: boolean
}

export interface ReactSelectProps {
  // Custom props
  label?: string
  description?: string
  errorMessage?: string
  isRequired?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  className?: string
  isInvalid?: boolean
  enableVerticalScroll?: boolean
  maxHeight?: string

  // React-select props
  options: SelectOption[]
  value?: SelectOption | SelectOption[] | null
  onChange?: (newValue: OnChangeValue<SelectOption, boolean>, actionMeta: ActionMeta<SelectOption>) => void
  placeholder?: string
  isDisabled?: boolean
  isLoading?: boolean
  isMulti?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  closeMenuOnSelect?: boolean
  noOptionsMessage?: (obj: { inputValue: string }) => string
  loadingMessage?: () => string
  menuIsOpen?: boolean
  onMenuOpen?: () => void
  onMenuClose?: () => void
  autoFocus?: boolean
  name?: string
  inputId?: string
  menuPlacement?: 'auto' | 'bottom' | 'top'
  menuPosition?: 'absolute' | 'fixed'
}

// Custom styles to match DaisyUI design system
const getCustomStyles = (
  size: 'sm' | 'md' | 'lg' = 'md',
  variant: 'flat' | 'bordered' | 'faded' | 'underlined' = 'flat',
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'default',
  isInvalid: boolean = false,
  enableVerticalScroll: boolean = false,
  maxHeight: string = '200px'
): StylesConfig<SelectOption, boolean, GroupBase<SelectOption>> => ({
  control: (provided, state) => {
    const baseStyles = {
      ...provided,
      minHeight: size === 'sm' ? '32px' : size === 'lg' ? '48px' : '40px',
      maxHeight: enableVerticalScroll ? maxHeight : 'none',
      fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px',
      borderWidth: variant === 'bordered' ? '2px' : '1px',
      borderRadius: '12px', // HeroUI default radius
      borderColor: isInvalid
        ? '#f31260' // danger color
        : state.isFocused
          ? color === 'primary'
            ? '#006FEE'
            : '#006FEE' // primary color
          : variant === 'bordered'
            ? '#d4d4d8'
            : '#e4e4e7', // default gray
      backgroundColor: variant === 'flat' ? '#f4f4f5' : '#ffffff',
      boxShadow: state.isFocused ? `0 0 0 2px ${color === 'primary' ? '#006FEE20' : '#006FEE20'}` : 'none',
      '&:hover': {
        borderColor: isInvalid ? '#f31260' : color === 'primary' ? '#006FEE' : '#006FEE'
      },
      transition: 'all 150ms ease',
      cursor: 'pointer'
    }
    return baseStyles
  },

  valueContainer: (provided) => ({
    ...provided,
    padding: size === 'sm' ? '2px 8px' : size === 'lg' ? '8px 12px' : '4px 12px',
    overflowY: enableVerticalScroll ? ('auto' as const) : ('visible' as const),
    maxHeight: enableVerticalScroll ? `calc(${maxHeight} - 16px)` : 'none',
    flexWrap: enableVerticalScroll ? ('wrap' as const) : ('wrap' as const)
  }),

  input: (provided) => ({
    ...provided,
    margin: 0,
    paddingBottom: 0,
    paddingTop: 0,
    color: '#11181c', // foreground color
    caretColor: '#11181c' // cursor color
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#71717a', // muted foreground
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px'
  }),

  singleValue: (provided) => ({
    ...provided,
    color: '#11181c', // foreground color
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px'
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e4e4e7', // neutral-200
    borderRadius: '6px',
    fontSize: size === 'sm' ? '12px' : '14px'
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: '#3f3f46', // neutral-700
    fontSize: size === 'sm' ? '12px' : '14px',
    fontWeight: '500'
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: '#71717a',
    borderRadius: '0 6px 6px 0',
    '&:hover': {
      backgroundColor: '#dc2626', // red-600
      color: '#ffffff'
    }
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: '#d4d4d8' // neutral-300
  }),

  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? '#006FEE' : '#71717a',
    '&:hover': {
      color: '#006FEE'
    },
    transition: 'all 150ms ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none'
  }),

  clearIndicator: (provided) => ({
    ...provided,
    color: '#71717a',
    '&:hover': {
      color: '#dc2626'
    }
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: '12px',
    border: '1px solid #e4e4e7',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    // Very high z-index to ensure dropdown appears above modals and other overlays
    zIndex: 9999999
  }),

  menuList: (provided) => ({
    ...provided,
    padding: '4px',
    borderRadius: '12px'
  }),

  option: (provided, state) => ({
    ...provided,
    borderRadius: '8px',
    margin: '2px 0',
    padding: size === 'sm' ? '6px 8px' : size === 'lg' ? '12px 12px' : '8px 12px',
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px',
    backgroundColor: state.isSelected
      ? '#006FEE' // primary
      : state.isFocused
        ? '#f1f5f9' // slate-100
        : 'transparent',
    color: state.isSelected
      ? '#ffffff'
      : state.isFocused
        ? '#0f172a' // slate-900
        : '#334155', // slate-700
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#0054d1' : '#e2e8f0' // slate-200
    }
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#71717a',
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '6px 8px' : size === 'lg' ? '12px 12px' : '8px 12px'
  }),

  loadingMessage: (provided) => ({
    ...provided,
    color: '#71717a',
    fontSize: size === 'sm' ? '14px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '6px 8px' : size === 'lg' ? '12px 12px' : '8px 12px'
  })
})

export const ReactSelect = ({
  label,
  description,
  errorMessage,
  isRequired,
  size = 'md',
  variant = 'flat',
  color = 'default',
  className,
  isInvalid,
  enableVerticalScroll = false,
  maxHeight = '200px',
  ...selectProps
}: ReactSelectProps) => {
  const customStyles = getCustomStyles(
    size,
    variant,
    color,
    isInvalid || !!errorMessage,
    enableVerticalScroll,
    maxHeight
  )

  // Helper function for class names
  const classNames = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {label && (
        <label
          className={classNames(
            'text-sm font-medium select-none',
            isInvalid || errorMessage ? 'text-red-600' : 'text-gray-900'
          )}
        >
          {label}
          {isRequired && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <Select<SelectOption, boolean, GroupBase<SelectOption>>
        {...selectProps}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={selectProps.placeholder || 'Select...'}
        menuPlacement={selectProps.menuPlacement || 'auto'}
        menuPosition={selectProps.menuPosition || 'fixed'}
        noOptionsMessage={
          selectProps.noOptionsMessage ||
          (({ inputValue }) => (inputValue ? `No options found for "${inputValue}"` : 'No options available'))
        }
        loadingMessage={selectProps.loadingMessage || (() => 'Loading...')}
      />

      {description && !errorMessage && <div className="text-xs text-gray-500 mt-1">{description}</div>}

      {errorMessage && <div className="text-xs text-red-600 mt-1">{errorMessage}</div>}
    </div>
  )
}

export default ReactSelect
