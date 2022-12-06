import Blockquote from './blockquote'
import Code from "./code"
import Fence from './fence'
import Heading from "./heading"
import Hr from './hr'
import Paragraph from "./paragraph"
import Reference from './reference'
import SetextHeading from './setextHeading'
import type { TBlockRuleFn } from '../../type'

const blockRules: TBlockRuleFn[] = [
  Code,
  Fence,
  Blockquote,
  Hr,
  Reference,
  Heading,
  SetextHeading,
  Paragraph,
]

export default blockRules