/**
 * mdquiz — Parse markdown quiz files into structured objects.
 *
 * Supports YAML frontmatter, checkbox answers (- [x] / - [ ]),
 * code blocks, and per-answer explanations.
 */

export { parseDirectory } from './loader'
export type { ParseDirOptions } from './loader'
export { parseQuestionFile } from './parser'
export type { AnswerOption, Question } from './types'
