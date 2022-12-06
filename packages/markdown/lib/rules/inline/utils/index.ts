import { 
  RULE_INLINE_BACKTICK,
  RULE_INLINE_EMPHASIS,
  RULE_INLINE_STRONG,
} from '../ruleName'

export const TypeTagMap = {
  [RULE_INLINE_BACKTICK]: 'code',
  [RULE_INLINE_EMPHASIS]: 'em',
  [RULE_INLINE_STRONG]: 'strong'
}
