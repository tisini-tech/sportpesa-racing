export interface QuestionChoice {
  id: number
  question: number
  text: string
  team: number
}

export interface Question {
  choices: QuestionChoice[]
  id: number
  question_set: number
  answer_type: string
  text: string
  order: number
  image_url: string | null
  points: number
  timer_seconds: number
  is_required: boolean
  team: number
  metric: number
  metric_detail: number
}

export interface Quiz {
  id: number
  title: string
  description: string
  image_url: string | null
  type: string
  play_mode: string
  status: string
  starts_at: string
  ends_at: string
  is_public: boolean
  is_payable: boolean
  amount_payable: string
  prize_description: string | null
  company: number
  match: number | null
  questions?: Question[]
}

export interface QuizSubmitResponse {
  message: string
  error: string
}

export interface Country {
  id: number
  name: string
  iso_code2: string
  iso_code3: string
  telephone_code: string
  nationality: string
}
