import { RuntimeObject } from 'wollok-ts'
import { Interpreter } from 'wollok-ts/dist/interpreter/interpreter'

const { round } = Math

export interface CanvasResolution {
  width: number
  height: number
}
export function canvasResolution(interpreter: Interpreter): CanvasResolution {
  const game = interpreter.object('wollok.game.game')
  const cellPixelSize = game.get('cellSize')!.innerNumber!
  const width = round(game.get('width')!.innerNumber!)
  const height = round(game.get('height')!.innerNumber!)
  return { width, height }
}
export interface VisualState {
  image?: string
  position: Position
  text?: string
  textColor?: string
  id?: string
}
export interface Position {
  x: number
  y: number
}
export interface Image {
  name: string
  url: string
}
export function invokeMethod(
  interpreter: Interpreter,
  visual: RuntimeObject,
  method: string,
  ...args: RuntimeObject[]
) {
  const lookedUpMethod = visual.module.lookupMethod(method, 0)
  return (
    lookedUpMethod && interpreter.invoke(lookedUpMethod, visual, ...args)?.innerString
  )
}
export function visualState(
  interpreter: Interpreter,
  visual: RuntimeObject,
): VisualState {
  const image = invokeMethod(interpreter, visual, 'image')
  const position = interpreter.send('position', visual)!
  const roundedPosition = interpreter.send('round', position)!
  const x = roundedPosition.get('x')!.innerNumber!
  const y = roundedPosition.get('y')!.innerNumber!
  const text = invokeMethod(interpreter, visual, 'text')
  const textColor = invokeMethod(interpreter, visual, 'textColor')
  const id = invokeMethod(interpreter, visual, 'id')

  return { image, position: { x, y }, text, textColor, id }
}
export function queueEvent(
  interpreter: Interpreter,
  ...events: RuntimeObject[]
): void {
  const io = interpreter.object('wollok.lang.io')
  events.forEach((e) => interpreter.send('queueEvent', io, e))
}

export function buildKeyPressEvent(
  interpreter: Interpreter,
  keyCode: string,
): RuntimeObject {
  return interpreter.list(
    interpreter.reify('keypress'),
    interpreter.reify(keyCode),
  )
}

export function wKeyCode(keyName: string, keyCode: number): string {
  //These keyCodes correspond to http://keycode.info/
  if (keyCode >= 48 && keyCode <= 57) return `Digit${keyName}` //Numbers (non numpad)
  if (keyCode >= 65 && keyCode <= 90) return `Key${keyName.toUpperCase()}` //Letters
  if (keyCode === 18) return 'AltLeft'
  if (keyCode === 225) return 'AltRight'
  if (keyCode === 8) return 'Backspace'
  if (keyCode === 17) return 'Control'
  if (keyCode === 46) return 'Delete'
  if (keyCode >= 37 && keyCode <= 40) return keyName //Arrows
  if (keyCode === 13) return 'Enter'
  if (keyCode === 189) return 'Minus'
  if (keyCode === 187) return 'Plus'
  if (keyCode === 191) return 'Slash'
  if (keyCode === 32) return 'Space'
  if (keyCode === 16) return 'Shift'
  return '' //If an unknown key is pressed, a string should be returned
}
