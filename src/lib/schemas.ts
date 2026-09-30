import { z } from 'zod'

const kenyaPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine((value) => !value.startsWith('0'), {
    message: 'Do not include the leading 0',
  })
  .regex(/^[1-9]\d{8}$/, 'Enter a 9-digit phone number (no leading 0)')

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const

export type GenderValue = (typeof GENDER_OPTIONS)[number]['value']

export const fanSurveySchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(40, 'Username must be at most 40 characters'),
  countryCode: z.string().min(1, 'Country code is required'),
  phone: kenyaPhoneSchema,
  age: z
    .string()
    .trim()
    .min(1, 'Age is required')
    .regex(/^\d{1,3}$/, 'Enter a valid age')
    .refine((value) => {
      const age = Number(value)
      return age >= 18 && age <= 100
    }, 'You must be between 18 and 100'),
  gender: z
    .union([
      z.literal(''),
      z.enum(['male', 'female', 'prefer_not_to_say']),
    ])
    .refine((value): value is GenderValue => value !== '', {
      message: 'Select your gender',
    }),
})

export type FanSurveyValues = z.infer<typeof fanSurveySchema>

/** Combine dial code + local digits → e.g. +254713909472 */
export function formatE164Phone(countryCode: string, localPhone: string): string {
  const code = countryCode.trim().startsWith('+')
    ? countryCode.trim()
    : `+${countryCode.trim()}`
  const digits = localPhone.trim().replace(/\D/g, '').replace(/^0+/, '')
  return `${code}${digits}`
}

/** Live phone checks so leading-0 errors show before submit. */
export function validatePhoneLive(value: string): string | undefined {
  if (!value) return undefined
  if (value.startsWith('0')) return 'Do not include the leading 0'
  if (!/^\d+$/.test(value)) return 'Phone number must contain digits only'
  if (value.length > 9) return 'Phone number must be exactly 9 digits'
  return undefined
}
