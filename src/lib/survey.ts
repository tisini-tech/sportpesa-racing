import type { Question, QuestionChoice } from '#/lib/types'
import type { GenderValue } from '#/lib/schemas'

function normalize(text: string) {
  return text.trim().toLowerCase()
}

export function findQuestion(
  questions: Question[],
  label: string,
): Question | undefined {
  const target = normalize(label)
  return questions.find((question) => normalize(question.text) === target)
}

export function findChoice(
  question: Question | undefined,
  label: string,
): QuestionChoice | undefined {
  if (!question) return undefined
  const target = normalize(label)
  return question.choices.find((choice) => normalize(choice.text) === target)
}

/** Map UI gender values → API choice labels on the Gender question. */
const GENDER_CHOICE_LABEL: Record<GenderValue, string> = {
  male: 'Male',
  female: 'Female',
  prefer_not_to_say: 'Prefer not to say',
}

export type SurveyFieldMap = {
  username?: Question
  phone?: Question
  age?: Question
  isUsed?: Question
  gender?: Question
}

export function mapSurveyQuestions(questions: Question[]): SurveyFieldMap {
  return {
    username: findQuestion(questions, 'Username'),
    phone: findQuestion(questions, 'Phone Number'),
    age: findQuestion(questions, 'Age'),
    isUsed: findQuestion(questions, 'Is used'),
    gender: findQuestion(questions, 'Gender'),
  }
}

export function genderChoiceId(
  genderQuestion: Question | undefined,
  gender: GenderValue,
): number | undefined {
  return findChoice(genderQuestion, GENDER_CHOICE_LABEL[gender])?.id
}

export function defaultNoChoiceId(
  isUsedQuestion: Question | undefined,
): number | undefined {
  return findChoice(isUsedQuestion, 'No')?.id
}
