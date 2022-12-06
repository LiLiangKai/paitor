import Backticks from './backticks'
import Emphasis from './emphasis'
import Text from './text'
import type { TInlineRuleFn } from '../../type'

export * from './ruleName'
export * from './utils'

const inlineRules: TInlineRuleFn[] = [
  Text,
  Backticks,
  Emphasis
]

export default inlineRules