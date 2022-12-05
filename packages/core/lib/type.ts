import type Paitor from './index'
import type State from './state'
import type { TLineMetas, TLineMeta } from './state'
import type { IToken } from './state/token'

export type TRuleFn<F = Function> = F & {
  ruleName: string
  terminators?: string[]
}

export type TBlockRuleFn = TRuleFn<(meta: TLineMeta, state: State, paitor: Paitor, silent?: boolean) => boolean | number>

export type TInlineRuleFn = TRuleFn<(token: IToken, state: State, paitor: Paitor, silent?: boolean) => boolean>

export type {
  Paitor,
  State,
  IToken,
  TLineMeta,
  TLineMetas
}