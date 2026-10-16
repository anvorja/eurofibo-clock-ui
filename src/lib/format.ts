/** Fibonacci(10000) tiene más de 2000 dígitos: se abrevia para la vista, el valor completo queda en `title` y en la respuesta cruda. */
export function abbreviate(value: string, head = 12, tail = 6): string {
  return value.length <= head + tail + 1 ? value : `${value.slice(0, head)}…${value.slice(-tail)}`
}

export function splitClock(hms: string): { h: string; m: string; s: string } {
  const [h = '00', m = '00', s = '00'] = hms.split(':')
  return { h, m, s: s.slice(0, 2) }
}
