import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react'

import type { TanStackInputFieldApi } from '#/components/forms/input-field'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import type { Country } from '#/lib/types'
import { cn } from '#/lib/utils'

export const DEFAULT_KENYA_ID = 116

export function getDefaultCountry(countries: Country[]): Country | undefined {
  return (
    countries.find((country) => country.id === DEFAULT_KENYA_ID) ??
    countries.find((country) => country.iso_code2 === 'KE') ??
    countries[0]
  )
}

const controlClass =
  'h-11 rounded-xl border border-white/20 bg-white/10 text-white outline-none transition-[color,box-shadow] focus-visible:border-brand-pink focus-visible:ring-3 focus-visible:ring-brand-pink/30'

export function PhoneField({
  phoneField,
  countryCodeField,
  countries,
  id = 'phone',
  label = 'Phone number',
  className,
  liveError,
}: {
  phoneField: TanStackInputFieldApi<string>
  countryCodeField: TanStackInputFieldApi<string>
  countries: Country[]
  id?: string
  label?: string
  className?: string
  liveError?: string
}) {
  const isInvalid =
    Boolean(liveError) ||
    (phoneField.state.meta.isTouched && !phoneField.state.meta.isValid) ||
    (countryCodeField.state.meta.isTouched &&
      !countryCodeField.state.meta.isValid)

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries],
  )

  const selectedCountry =
    sortedCountries.find(
      (country) => country.telephone_code === countryCodeField.state.value,
    ) ?? getDefaultCountry(sortedCountries)

  const errorMessage =
    liveError ??
    ([...phoneField.state.meta.errors, ...countryCodeField.state.meta.errors]
      .map((error) =>
        typeof error === 'string'
          ? error
          : error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : '',
      )
      .find(Boolean) ??
      'Enter a 9-digit phone number (no leading 0)')

  return (
    <Field
      className={cn('gap-2', className)}
      data-invalid={isInvalid ? true : undefined}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div className="flex items-stretch gap-2">
        <CountryCodePicker
          countries={sortedCountries}
          selected={selectedCountry}
          value={countryCodeField.state.value}
          onChange={(code) => countryCodeField.handleChange(code)}
        />

        <input
          id={id}
          name={phoneField.name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="712 345 678"
          maxLength={9}
          value={phoneField.state.value}
          onBlur={phoneField.handleBlur}
          onChange={(event) => {
            phoneField.handleChange(
              event.target.value.replace(/\D/g, '').slice(0, 9),
            )
          }}
          aria-invalid={isInvalid || undefined}
          className={cn(
            controlClass,
            'min-w-0 flex-1 px-3 text-base placeholder:text-white/40 md:text-sm',
            isInvalid &&
              'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
          )}
        />
      </div>

      {isInvalid ? (
        <FieldError>{errorMessage}</FieldError>
      ) : (
        <p className="text-xs text-[#b8c4ef]/60">
          Enter 9 digits without the leading 0
        </p>
      )}
    </Field>
  )
}

function CountryCodePicker({
  countries,
  selected,
  value,
  onChange,
}: {
  countries: Country[]
  selected: Country | undefined
  value: string
  onChange: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries

    return countries.filter((country) => {
      const haystack = [
        country.name,
        country.iso_code2,
        country.iso_code3,
        country.telephone_code,
        country.nationality,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [countries, query])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      searchRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  return (
    <div ref={rootRef} className="relative w-[7.75rem] shrink-0 sm:w-[9.5rem]">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Country code"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          controlClass,
          'flex w-full items-center justify-between gap-1 px-2.5 text-left text-sm font-semibold sm:gap-2 sm:px-3',
          'hover:bg-white/15',
        )}
      >
        <span className="truncate tabular-nums">
          {selected ? (
            <>
              <span className="hidden sm:inline">{selected.iso_code2} </span>
              {selected.telephone_code}
            </>
          ) : (
            value || 'Code'
          )}
        </span>
        <ChevronsUpDownIcon
          className="size-3.5 shrink-0 text-[#b8c4ef]/70 sm:size-4"
          aria-hidden
        />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+0.35rem)] left-0 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/20 bg-brand-navy-deep shadow-lg ring-1 ring-white/10 sm:w-72">
          <div className="flex items-center gap-2 border-b border-white/15 px-3 py-2">
            <SearchIcon
              className="size-4 shrink-0 text-[#b8c4ef]/70"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country…"
              className="h-8 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              aria-label="Search country"
            />
          </div>

          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto overscroll-contain p-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-[#b8c4ef]/70">
                No countries found
              </li>
            ) : (
              filtered.map((country) => {
                const isSelected = country.telephone_code === value

                return (
                  <li key={country.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(country.telephone_code)
                        setOpen(false)
                        setQuery('')
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-[#dce3ff] transition-colors',
                        isSelected
                          ? 'bg-brand-pink/20 text-white'
                          : 'hover:bg-white/10',
                      )}
                    >
                      <span className="w-14 shrink-0 font-semibold tabular-nums">
                        {country.telephone_code}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {country.name}
                      </span>
                      <span className="shrink-0 text-xs text-[#b8c4ef]/70">
                        {country.iso_code2}
                      </span>
                      {isSelected ? (
                        <CheckIcon className="size-4 shrink-0 text-brand-pink-hot" />
                      ) : (
                        <span className="size-4 shrink-0" aria-hidden />
                      )}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
