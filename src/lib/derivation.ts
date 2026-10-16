import type { Capital, EuroFiboResult } from './api'
import { splitClock } from './format'

export interface Step {
  label: string
  formula: string
  value: string
  /** Capital a la que apunta el paso, si el paso termina en una. */
  capital?: Capital
}

export interface Outcome {
  capital: Capital
  clock: string
  /** Posición del destino en el catálogo circular. */
  index: number
  steps: Step[]
  passport?: string
  path?: Capital[]
}

/** Ordena los campos que devuelve el API como los pasos del algoritmo (README / PDF). No recalcula nada. */
export function outcomeOf(r: EuroFiboResult, size: number): Outcome {
  const { h, m, s } = splitClock(r.colombianTime)
  const hms = `${h}:${m}:${s}`
  const fib: Step = { label: 'Fibonacci de n', formula: `fib(${r.fibonacciInput})`, value: r.fibonacciValue }

  switch (r.algorithm) {
    case 'a1':
      return {
        capital: r.selected,
        clock: hms,
        index: r.capitalIndex,
        steps: [
          fib,
          { label: 'Factor Fibonacci', formula: 'n + fib(n)', value: r.fibonacciFactor },
          { label: 'Factor temporal', formula: `${h} + ${m} + ${s}`, value: String(r.temporalFactor) },
          { label: 'Índice bruto', formula: '⌊factor temporal ÷ factor Fibonacci⌋', value: r.rawIndex },
          { label: 'Índice de capital', formula: `índice bruto mod ${size}`, value: String(r.capitalIndex), capital: r.selected },
        ],
      }
    case 'a2':
      return {
        capital: r.destination,
        clock: hms,
        index: r.capitalIndex,
        passport: r.passportCode,
        steps: [
          fib,
          { label: 'Código Fibonacci', formula: 'n + fib(n)', value: r.fibonacciCode },
          { label: 'European Temporal Score', formula: `${h} × código + ${m} + ${s}`, value: r.temporalScore },
          { label: 'Índice de capital', formula: `ETS mod ${size}`, value: String(r.capitalIndex), capital: r.destination },
        ],
      }
    case 'a3':
      return {
        capital: r.destinationCapital,
        clock: hms,
        index: r.destinationIndex,
        path: r.path,
        steps: [
          { ...fib },
          { label: 'Punto de partida', formula: `fib(n) mod ${size}`, value: String(r.startIndex), capital: r.startCapital },
          { label: 'Desplazamiento temporal', formula: `${h} × ${m} + ${s}`, value: String(r.temporalDisplacement) },
          { label: 'Desplazamiento efectivo', formula: `desplazamiento mod ${size}`, value: String(r.effectiveDisplacement) },
          { label: 'Destino', formula: `(inicio + efectivo) mod ${size}`, value: String(r.destinationIndex), capital: r.destinationCapital },
        ],
      }
  }
}
