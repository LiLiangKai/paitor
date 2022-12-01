import { NEW_LINES_RE } from './regexp'

export function isSpace(charCode: number) {
  return charCode === 0x20 || charCode === 0x09
}

export function isTabSpace(charCode: number) {
  return charCode === 0x09
}

export function skipSpace(str: string, pos: number) {
  for(;pos<str.length && isSpace(str.charCodeAt(pos));pos++);
  return pos
}

export function isWhiteSpace(charCode: number) {
  if(charCode >= 0x2000 && charCode <= 0x200A) return true
  switch(charCode) {
    case 0x09: // \t
    case 0x0A: // \n
    case 0x0B: // \v
    case 0x0C: // \f
    case 0x0D: // \r
      return true
  }
  return false
}

export function normalize(str: string) {
  // 处理换行符，统一为\n
  return str.replace(NEW_LINES_RE, '\n')
} 