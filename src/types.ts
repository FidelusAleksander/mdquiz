/** A single answer option */
export interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
  /** Optional per-answer explanation from blockquote lines after the answer */
  explanation?: string
}

/** A parsed quiz question */
export interface Question {
  /** Unique identifier derived from filename */
  id: string
  /** The question text (from frontmatter) */
  question: string
  /** Available answers */
  answers: AnswerOption[]
  /** Whether multiple answers are correct */
  isMultiSelect: boolean
  /** Optional code block shown before answers (question context) */
  codeBlock?: string
  /** All frontmatter fields (title, question, and any custom fields) */
  frontmatter: Record<string, unknown>
}
