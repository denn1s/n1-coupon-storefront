import { FC } from 'react'
import { Checkbox as HCheckbox, Field, Label } from '@headlessui/react'
import clsx from 'clsx'
import styles from './Checkbox.module.css'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className,
}) => {
  return (
    <Field className={clsx('flex items-center', className)}>
      <HCheckbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          styles.checkbox,
          disabled && styles.disabledCheckbox
        )}
      >
        <svg
          className={clsx(
            styles.checkmark,
            !checked && styles.checkmarkHidden
          )}
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HCheckbox>
      {label && (
        <Label className={clsx(styles.label, disabled && styles.disabled)}>
          {label}
        </Label>
      )}
    </Field>
  )
}

export default Checkbox

