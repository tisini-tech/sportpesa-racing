import { useMemo, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Loader2Icon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { InputField } from '#/components/forms/input-field'
import {
  getDefaultCountry,
  PhoneField,
} from '#/components/forms/phone-field'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import {
  submitQuizFn,
  type QuizSubmitAnswer,
} from '#/data/engagements'
import {
  fanSurveySchema,
  formatE164Phone,
  GENDER_OPTIONS,
  validatePhoneLive,
  type GenderValue,
} from '#/lib/schemas'
import {
  defaultNoChoiceId,
  genderChoiceId,
  mapSurveyQuestions,
} from '#/lib/survey'
import type { Country, Question } from '#/lib/types'
import { cn } from '#/lib/utils'

const fieldInputClass =
  'h-11 w-full min-w-0 rounded-xl border border-white/20 bg-white/10 px-3 text-base text-white outline-none transition-[color,box-shadow] placeholder:text-white/40 focus-visible:border-brand-pink focus-visible:ring-3 focus-visible:ring-brand-pink/30 md:text-sm'

type RegisterSectionProps = {
  quizId: string
  questions: Question[]
  countries: Country[]
}

export default function RegisterSection({
  quizId,
  questions,
  countries,
}: RegisterSectionProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const fields = useMemo(() => mapSurveyQuestions(questions), [questions])
  const defaultCountry = useMemo(
    () => getDefaultCountry(countries),
    [countries],
  )

  const genderOptions = useMemo(() => {
    if (fields.gender?.choices.length) {
      return fields.gender.choices.map((choice) => {
        const known = GENDER_OPTIONS.find(
          (option) =>
            option.label.toLowerCase() === choice.text.trim().toLowerCase(),
        )
        return {
          value: (known?.value ??
            choice.text.trim().toLowerCase().replace(/\s+/g, '_')) as
            | GenderValue
            | string,
          label: choice.text,
          choiceId: choice.id,
        }
      })
    }

    return GENDER_OPTIONS.map((option) => ({
      ...option,
      choiceId: undefined as number | undefined,
    }))
  }, [fields.gender])

  const form = useForm({
    defaultValues: {
      username: '',
      countryCode: defaultCountry?.telephone_code ?? '+254',
      phone: '',
      age: '',
      gender: '',
    },
    validators: {
      onSubmit: fanSurveySchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      if (
        !fields.username ||
        !fields.phone ||
        !fields.age ||
        !fields.gender ||
        !fields.isUsed
      ) {
        setSubmitError('Survey questions are missing. Please refresh the page.')
        return
      }

      const genderId =
        genderOptions.find((option) => option.value === value.gender)
          ?.choiceId ??
        genderChoiceId(fields.gender, value.gender as GenderValue)

      const noChoiceId = defaultNoChoiceId(fields.isUsed)

      if (!genderId || !noChoiceId) {
        setSubmitError('Could not match survey choices. Please refresh.')
        return
      }

      const answers: QuizSubmitAnswer[] = [
        {
          questionId: fields.username.id,
          textAnswer: value.username,
          responseMs: 0,
          localId: crypto.randomUUID(),
        },
        {
          questionId: fields.phone.id,
          textAnswer: formatE164Phone(value.countryCode, value.phone),
          responseMs: 0,
          localId: crypto.randomUUID(),
        },
        {
          questionId: fields.age.id,
          textAnswer: value.age,
          responseMs: 0,
          localId: crypto.randomUUID(),
        },
        {
          // Hidden "Is used" — always submit No
          questionId: fields.isUsed.id,
          choiceIds: [noChoiceId],
          responseMs: 0,
          localId: crypto.randomUUID(),
        },
        {
          questionId: fields.gender.id,
          choiceIds: [genderId],
          responseMs: 0,
          localId: crypto.randomUUID(),
        },
      ]

      try {
        await submitQuizFn({ data: { quizId, answers } })
        setSubmitted(true)
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Failed to submit registration',
        )
      }
    },
  })

  return (
    <section
      id="register"
      className="relative isolate scroll-mt-8 overflow-hidden px-6 py-20 text-white sm:px-10 md:px-14"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="/racing-car-register.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-[center_40%] brightness-[0.95] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-brand-navy-deep/82" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep/90 via-brand-navy-deep/75 to-brand-navy-deep/55" />
      </div>

      <div className="relative mx-auto max-w-xl">
        <h2 className="font-heading text-3xl font-semibold tracking-wide uppercase sm:text-4xl">
          Fan registration
        </h2>
        <p className="mt-3 text-[#b8c4ef]/85">
          Drop your details for a chance to see the SportPesa Racing car up
          close.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-2xl border border-brand-pink/40 bg-brand-pink/10 px-5 py-6 backdrop-blur-sm">
            <p className="font-heading text-xl tracking-wide uppercase text-brand-pink-hot">
              You&apos;re in
            </p>
            <p className="mt-2 text-sm text-[#dce3ff]/90">
              Thanks for registering. We&apos;ll be in touch about the mall tour.
              Remember the username and phone number you used.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5 h-10 rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                form.reset()
                setSubmitted(false)
                setSubmitError(null)
              }}
            >
              Submit another response
            </Button>
          </div>
        ) : (
          <form
            className="mt-10"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-5">
              <form.Field
                name="username"
                children={(field) => (
                  <InputField
                    field={field}
                    label={fields.username?.text ?? 'Username'}
                    placeholder="Your username"
                    autoComplete="username"
                    inputClassName={fieldInputClass}
                  />
                )}
              />

              <form.Field
                name="countryCode"
                children={(countryCodeField) => (
                  <form.Field
                    name="phone"
                    validators={{
                      onChange: ({ value }) => validatePhoneLive(value),
                      onBlur: ({ value }) => {
                        if (!value) return 'Phone number is required'
                        return validatePhoneLive(value)
                      },
                    }}
                    children={(phoneField) => (
                      <PhoneField
                        phoneField={phoneField}
                        countryCodeField={countryCodeField}
                        countries={countries}
                        label={fields.phone?.text ?? 'Phone number'}
                        liveError={validatePhoneLive(phoneField.state.value)}
                      />
                    )}
                  />
                )}
              />

              <form.Field
                name="age"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid ? true : undefined}>
                      <FieldLabel htmlFor="age">
                        {fields.age?.text ?? 'Age'}
                      </FieldLabel>
                      <input
                        id="age"
                        name={field.name}
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 24"
                        maxLength={3}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          field.handleChange(
                            event.target.value.replace(/\D/g, '').slice(0, 3),
                          )
                        }}
                        aria-invalid={isInvalid || undefined}
                        className={fieldInputClass}
                      />
                      {isInvalid ? (
                        <FieldError
                          errors={
                            field.state.meta.errors as Array<
                              { message?: string } | undefined
                            >
                          }
                        />
                      ) : null}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="gender"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid ? true : undefined}>
                      <FieldLabel>
                        {fields.gender?.text ?? 'Gender'}
                      </FieldLabel>
                      <RadioGroup
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange((value ?? '') as GenderValue | '')
                        }}
                        className="gap-2.5"
                      >
                        {genderOptions.map((option) => (
                          <label
                            key={option.value}
                            htmlFor={`gender-${option.value}`}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 backdrop-blur-sm transition-colors',
                              'hover:border-brand-pink/50 hover:bg-white/10',
                              field.state.value === option.value &&
                                'border-brand-pink/60 bg-brand-pink/10',
                            )}
                          >
                            <RadioGroupItem
                              id={`gender-${option.value}`}
                              value={option.value}
                              className="border-white/30 bg-white/15 data-checked:bg-brand-pink"
                            />
                            <span className="text-sm text-[#dce3ff]">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </RadioGroup>
                      {isInvalid ? (
                        <FieldError
                          errors={
                            field.state.meta.errors as Array<
                              { message?: string } | undefined
                            >
                          }
                        />
                      ) : null}
                    </Field>
                  )
                }}
              />

              {submitError ? (
                <p className="text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canSubmit || isSubmitting}
                    className="mt-2 h-12 w-full rounded-full bg-brand-pink text-base font-semibold tracking-wide text-white hover:bg-brand-pink-hot disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit registration'
                    )}
                  </Button>
                )}
              />
            </FieldGroup>
          </form>
        )}
      </div>
    </section>
  )
}
