import type Paitor from './index'
import type State from './state'
import type { TLineMetas, TLineMeta } from './state'
import type { IToken } from './state/token'

export type TRuleFn = ((meta: TLineMeta, state: State, paitor: Paitor, silent?: boolean) => boolean | number) & {
  ruleName: string
  terminators?: string[]
}

export type {
  Paitor,
  State,
  IToken,
  TLineMeta,
  TLineMetas
}