import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseDirectory, parseQuestionFile } from '../src'

const FIXTURES = join(__dirname, 'fixtures')

function readFixture(name: string): string {
  return readFileSync(join(FIXTURES, name), 'utf-8')
}

describe('parseQuestionFile', () => {
  it('parses a single-choice question', () => {
    const q = parseQuestionFile(readFixture('question-001.md'), 'question-001')

    expect(q.id).toBe('question-001')
    expect(q.question).toBe('Which syntax defines a job that runs on Ubuntu?')
    expect(q.isMultiSelect).toBe(false)
    expect(q.answers).toHaveLength(4)
    expect(q.answers.filter(a => a.isCorrect)).toHaveLength(1)
    expect(q.answers[0].isCorrect).toBe(true)
    expect(q.answers[0].text).toContain('runs-on: ubuntu-latest')
  })

  it('parses a multi-choice question', () => {
    const q = parseQuestionFile(readFixture('question-002.md'), 'question-002')

    expect(q.isMultiSelect).toBe(true)
    expect(q.answers.filter(a => a.isCorrect)).toHaveLength(2)
  })

  it('extracts hint from blockquote', () => {
    const q = parseQuestionFile(readFixture('question-001.md'), 'question-001')

    expect(q.hint).toBe('https://docs.github.com/en/actions')
  })

  it('extracts code block from preamble', () => {
    const q = parseQuestionFile(readFixture('question-003.md'), 'question-003')

    expect(q.codeBlock).toBeDefined()
    expect(q.codeBlock).toContain('runs-on: ubuntu-latest')
    expect(q.answers).toHaveLength(3)
  })

  it('exposes custom frontmatter fields', () => {
    const q = parseQuestionFile(readFixture('question-003.md'), 'question-003')

    expect(q.frontmatter.difficulty).toBe('medium')
    expect(q.frontmatter.question).toBe(q.question)
  })

  it('assigns sequential answer IDs', () => {
    const q = parseQuestionFile(readFixture('question-001.md'), 'question-001')

    expect(q.answers.map(a => a.id)).toEqual(['a1', 'a2', 'a3', 'a4'])
  })

  it('throws on missing question in frontmatter', () => {
    expect(() => parseQuestionFile(readFixture('bad-no-question.md'), 'bad'))
      .toThrow('Missing \'question\' in frontmatter')
  })

  it('throws on no answers', () => {
    expect(() => parseQuestionFile(readFixture('bad-no-answers.md'), 'bad'))
      .toThrow('No answers found')
  })

  describe('complex question with all features', () => {
    function getComplex() {
      return parseQuestionFile(readFixture('question-004.md'), 'question-004')
    }

    it('parses multi-select with mixed case X markers', () => {
      const q = getComplex()

      expect(q.isMultiSelect).toBe(true)
      expect(q.answers).toHaveLength(5)
      // Both [X] and [x] count as correct
      expect(q.answers[0].isCorrect).toBe(true)
      expect(q.answers[1].isCorrect).toBe(true)
      expect(q.answers[2].isCorrect).toBe(false)
      expect(q.answers[3].isCorrect).toBe(false)
      expect(q.answers[4].isCorrect).toBe(false)
    })

    it('extracts preamble code block with full content', () => {
      const q = getComplex()

      expect(q.codeBlock).toBeDefined()
      expect(q.codeBlock).toContain('strategy:')
      expect(q.codeBlock).toContain('matrix:')
      expect(q.codeBlock).toContain('node: [18, 20, 22]')
      expect(q.codeBlock).toContain('npm test')
    })

    it('uses the last hint blockquote from preamble', () => {
      const q = getComplex()

      // Two blockquotes in preamble — parser keeps the last one
      expect(q.hint).toContain('understanding-github-actions')
    })

    it('strips explanation blockquotes from answer text', () => {
      const q = getComplex()

      // Answer 4 has a blockquote explanation after it — should not appear in text
      expect(q.answers[3].text).not.toContain('This is wrong because')
    })

    it('includes code blocks within answer text', () => {
      const q = getComplex()

      // Answer 5 has a code block continuation
      expect(q.answers[4].text).toContain('# Any valid filename works')
    })

    it('exposes all custom frontmatter fields', () => {
      const q = getComplex()

      expect(q.frontmatter.difficulty).toBe('hard')
      expect(q.frontmatter.tags).toEqual(['actions', 'yaml'])
      expect(q.frontmatter.source).toBe('https://example.com/quiz-bank')
    })
  })
})

describe('parseDirectory', () => {
  it('parses all question files in a directory', () => {
    const questions = parseDirectory(FIXTURES, { filePrefix: 'question-' })

    expect(questions).toHaveLength(4)
    expect(questions.map(q => q.id).sort()).toEqual([
      'question-001',
      'question-002',
      'question-003',
      'question-004',
    ])
  })

  it('skips files starting with underscore', () => {
    const questions = parseDirectory(FIXTURES)
    const ids = questions.map(q => q.id)

    expect(ids).not.toContain('_index')
  })

  it('filters by filePrefix', () => {
    const questions = parseDirectory(FIXTURES, { filePrefix: 'question-' })

    expect(questions.every(q => q.id.startsWith('question-'))).toBe(true)
  })

  it('returns empty array for directory with no matching files', () => {
    const questions = parseDirectory(FIXTURES, { filePrefix: 'nonexistent-' })

    expect(questions).toEqual([])
  })
})
