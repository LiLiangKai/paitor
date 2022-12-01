const ESCAPED_CHARS = '\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
const HTML_ESCAPE_REPLACE_REG = /[&<>"]/g
const HTML_REPLACE_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}

export function escapeHtml(str: string) {
  if(!HTML_ESCAPE_REPLACE_REG.test(str)) return str
  return str.replace(HTML_ESCAPE_REPLACE_REG, (char) => HTML_REPLACE_CHARS[char])
}

// const ESCAPED = ESCAPED_CHARS.split('').reduce((map) => {}, {})

export function escape(str) {
  console.log(str)
}
