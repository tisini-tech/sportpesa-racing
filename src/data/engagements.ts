import type { Country, Quiz, QuizSubmitResponse } from '#/lib/types'
import { createServerFn } from '@tanstack/react-start'

export const getCountriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const baseURL = process.env.API_URL
    const apiKey = process.env.API_KEY

    if (!baseURL) {
      throw new Error('API_URL is not set')
    }
    if (!apiKey) {
      throw new Error('API_KEY is not set')
    }

    const response = await fetch(`${baseURL}/countries`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(detail || `Failed to get countries (${response.status})`)
    }

    return response.json() as Promise<Country[]>
  },
)

export const getQuizFn = createServerFn({ method: 'GET' })
  .validator((data: { quizId: string }) => data)
  .handler(async ({ data }) => {
    const baseURL = process.env.API_URL
    const apiKey = process.env.API_KEY

    if (!baseURL) {
      throw new Error('API_URL is not set')
    }
    if (!apiKey) {
      throw new Error('API_KEY is not set')
    }

    const response = await fetch(
      `${baseURL}/engagements/${data.quizId}/questions`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      },
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(detail || `Failed to get quiz (${response.status})`)
    }

    return response.json() as Promise<Quiz>
  })

export type QuizSubmitAnswer = {
  questionId: number
  choiceIds?: number[]
  textAnswer?: string
  responseMs?: number
  /** Required by survey API for idempotent retries. */
  localId: string
}

export const submitQuizFn = createServerFn({ method: 'POST' })
  .validator((data: { quizId: string; answers: QuizSubmitAnswer[] }) => data)
  .handler(async ({ data }) => {
    const baseURL = process.env.API_URL
    const apiKey = process.env.API_KEY

    if (!baseURL) {
      throw new Error('API_URL is not set')
    }
    if (!apiKey) {
      throw new Error('API_KEY is not set')
    }

    const response = await fetch(
      `${baseURL}/engagements/${data.quizId}/answers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(
          data.answers.map((answer) => {
            const choiceIds = answer.choiceIds ?? []
            return {
              question_id: answer.questionId,
              choice_id: choiceIds[0] ?? null,
              selected_choice_ids: choiceIds.length > 1 ? choiceIds : [],
              text_answer: answer.textAnswer ?? '',
              response_ms: answer.responseMs ?? 0,
              local_id: answer.localId,
            }
          }),
        ),
      },
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      let message = detail || `Failed to submit quiz (${response.status})`
      try {
        const parsed = JSON.parse(detail) as {
          detail?: string
          message?: string
        }
        message = parsed.detail || parsed.message || message
      } catch {
        // keep raw detail
      }
      throw new Error(message)
    }

    return response.json() as Promise<QuizSubmitResponse>
  })
