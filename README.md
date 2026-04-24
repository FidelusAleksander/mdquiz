# mdquiz

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Parse markdown quiz files into structured objects. Supports YAML frontmatter, checkbox answers, code blocks, and per-answer explanations.

## Install

```bash
npm install mdquiz
```

## Usage

### Parse a single file

```ts
import { readFileSync } from 'node:fs'
import { parseQuestionFile } from 'mdquiz'

const md = readFileSync('question-001.md', 'utf-8')
const question = parseQuestionFile(md, 'question-001')

console.log(question.question) // "Which syntax defines a job?"
console.log(question.answers) // [{ id: 'a1', text: '...', isCorrect: true, explanation: '...' }, ...]
console.log(question.isMultiSelect) // false
```

### Parse a directory

```ts
import { parseDirectory } from 'mdquiz'

const questions = parseDirectory('./questions', {
  filePrefix: 'question-', // only parse files starting with this prefix
  recursive: false, // walk subdirectories (default: false)
})
```

## Markdown Format

```markdown
---
question: "Which GitHub Actions syntax correctly defines a job that runs on Ubuntu?"
---

- [x] `runs-on: ubuntu-latest`
> This is the correct syntax for specifying a runner
- [ ] `os: ubuntu-latest`
- [ ] `platform: ubuntu-latest`
- [ ] `environment: ubuntu-latest`
```

Only the `question` field is required in frontmatter. Any additional fields you include (e.g. `title`, `category`, `difficulty`) are accessible via `question.frontmatter`:

```markdown
---
question: "What is a pull request?"
difficulty: easy
tags: ["git", "collaboration"]
---
```

### Structure

| Section | Required | Description |
|---------|----------|-------------|
| Frontmatter | Yes | YAML with `question` field (and any custom fields) |
| Code block | No | Context code shown before answers |
| Answers | Yes | Checkbox list: `- [x]` correct, `- [ ]` incorrect |
| Answer explanation | No | Blockquote (`>`) after an answer provides a per-answer explanation |

### Answer formats

Both ordered and unordered lists work:

```markdown
- [x] Correct answer
- [ ] Wrong answer

1. [x] Correct answer
1. [ ] Wrong answer
```

Multiple `[x]` marks make the question multi-select automatically.

### Per-answer explanations

Add a blockquote (`>`) immediately after an answer to provide an explanation. Multi-line explanations are joined with newlines:

```markdown
- [x] Correct answer
> This is why it's correct
- [ ] Wrong answer
> This is wrong because...
> Here is more detail
```

## API

### `parseQuestionFile(content: string, id: string): Question`

Parse a markdown string into a Question object.

### `parseDirectory(dir: string, options?: ParseDirOptions): Question[]`

Parse all `.md` files in a directory. Skips files starting with `_`.

### Types

```ts
interface Question {
  id: string
  question: string
  answers: AnswerOption[]
  isMultiSelect: boolean
  codeBlock?: string
  frontmatter: Record<string, unknown>
}

interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
  explanation?: string
}

interface ParseDirOptions {
  recursive?: boolean
  filePrefix?: string
}
```

## License

[MIT](./LICENSE.md) License


[npm-version-src]: https://img.shields.io/npm/v/mdquiz?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/mdquiz
[npm-downloads-src]: https://img.shields.io/npm/dm/mdquiz?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/mdquiz
[bundle-src]: https://img.shields.io/bundlephobia/minzip/mdquiz?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=mdquiz
[license-src]: https://img.shields.io/github/license/FidelusAleksander/mdquiz.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/FidelusAleksander/mdquiz/blob/main/LICENSE.md
