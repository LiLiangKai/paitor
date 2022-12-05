import { RULE_INLINE_BACKTICK } from '../ruleName'

export const TypeTagMap = {
  [RULE_INLINE_BACKTICK]: 'code',
}

export function pushContent(content: (string | string[])[], text: string) {
  const lastContentBlockIdx = content.length-1
  if(Array.isArray(content[lastContentBlockIdx])) {
    (content[lastContentBlockIdx] as string[]).push(text)
  } else {
    content.push([text])
  }
  return content
}

export function pushTypeContent(content: (string | string[])[], text: string, type: string) {
  const tag = TypeTagMap[type]
  if(!tag) {
    return pushContent(content, text)
  }
  content.push(
    tag,
    [text],
    tag
  )
  return content
}