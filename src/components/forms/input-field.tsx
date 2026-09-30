import type { ReactNode } from 'react'

import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

type FieldMeta = {
  errors: Array<unknown>
  isTouched: boolean
  isValid: boolean
}

export type TanStackInputFieldApi<T extends string | number = string> = {
  name: string
  state: {
    value: T
    meta: FieldMeta
  }
  handleChange: (value: T) => void
  handleBlur: () => void
}

export type InputFieldProps<T extends string | number = string> = {
  field: TanStackInputFieldApi<T>
  label: string
  labelEnd?: ReactNode
  type?: Exclude<
    React.HTMLInputTypeAttribute,
    | 'button'
    | 'checkbox'
    | 'file'
    | 'hidden'
    | 'image'
    | 'radio'
    | 'reset'
    | 'submit'
  >
  placeholder?: string
  autoComplete?: string
  id?: string
  className?: string
  inputClassName?: string
  min?: number | string
  max?: number | string
  step?: number | string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}

export function InputField<T extends string | number = string>({
  field,
  label,
  labelEnd,
  type = 'text',
  placeholder,
  autoComplete,
  id: idProp,
  className,
  inputClassName,
  min,
  max,
  step,
  inputMode,
  maxLength,
}: InputFieldProps<T>) {
  const id = idProp ?? field.name
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field
      className={cn(className)}
      data-invalid={isInvalid ? true : undefined}
    >
      {labelEnd ? (
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <span className="ml-auto">{labelEnd}</span>
        </div>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      <Input
        id={id}
        name={field.name}
        type={type}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={field.state.value as string | number}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (type === 'number') {
            const raw = e.target.value
            field.handleChange((raw === '' ? 0 : Number(raw)) as T)
            return
          }
          field.handleChange(e.target.value as T)
        }}
        aria-invalid={isInvalid || undefined}
        className={inputClassName}
      />

      {isInvalid ? (
        <FieldError
          errors={
            field.state.meta.errors as Array<{ message?: string } | undefined>
          }
        />
      ) : null}
    </Field>
  )
}
