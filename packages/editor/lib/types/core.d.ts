import type TCore from '../core'
import { IEditorOption } from './editor'

export type TCoreOption = Required<IEditorOption>
export type TPCore = Pick<TCore, 'editable'|'container'|'createBlock'|'deleteBlock'|'focusBlock'|'getPlugin'>
export { TCore }