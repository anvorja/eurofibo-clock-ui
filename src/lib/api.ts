// Cliente tipado del contrato `eurofibo-clock/src/main/resources/openapi/openapi.yaml`.
// El servidor es la fuente de verdad: aquí no se recalcula lógica de negocio.

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''

export type AlgorithmId = 'a1' | 'a2' | 'a3'

export interface ColombiaTime {
  zone: string
  date: string
  time: string
  utcOffset: string
  isoDateTime: string
  epochSecond: number
}
export interface FibonacciResult {
  n: number
  value: string
  digits: number
}
export interface Capital {
  country: string
  capital: string
}
export interface CapitalsResult {
  count: number
  capitals: Capital[]
}
export interface AlgorithmDescriptor {
  id: AlgorithmId
  name: string
  businessQuestion: string
  catalogueSize: number
}
export interface AlgorithmsResult {
  count: number
  algorithms: AlgorithmDescriptor[]
}
export interface CapitalSelection {
  algorithm: 'a1'
  fibonacciInput: number
  fibonacciValue: string
  fibonacciFactor: string
  colombianTime: string
  temporalFactor: number
  rawIndex: string
  capitalIndex: number
  selected: Capital
}
export interface TemporalPassport {
  algorithm: 'a2'
  fibonacciInput: number
  fibonacciValue: string
  fibonacciCode: string
  colombianTime: string
  temporalScore: string
  capitalIndex: number
  destination: Capital
  passportCode: string
}
export interface EuropeanJourney {
  algorithm: 'a3'
  fibonacciInput: number
  fibonacciValue: string
  startIndex: number
  startCapital: Capital
  colombianTime: string
  temporalDisplacement: number
  effectiveDisplacement: number
  destinationIndex: number
  destinationCapital: Capital
  path: Capital[]
}
export type EuroFiboResult = CapitalSelection | TemporalPassport | EuropeanJourney

export interface ApiErrorBody {
  error: 'domain-error' | 'invalid-request' | 'internal-error'
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorBody['error'] | 'network'
  constructor(status: number, kind: ApiError['kind'], message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
  }
}

/** Una respuesta junto con lo que hace falta para auditarla: URL, estado y latencia. */
export interface Traced<T> {
  data: T
  url: string
  status: number
  ms: number
  raw: string
}

async function get<T>(path: string, signal?: AbortSignal): Promise<Traced<T>> {
  const url = `${BASE}${path}`
  const t0 = performance.now()
  let res: Response
  try {
    res = await fetch(url, { signal, headers: { accept: 'application/json' } })
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError(0, 'network', 'No se pudo contactar con el API en 127.0.0.1:8484. ¿Está corriendo `sbt run`?')
  }
  const raw = await res.text()
  const ms = Math.round(performance.now() - t0)
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    throw new ApiError(res.status, 'internal-error', `Respuesta no JSON del servidor (HTTP ${res.status}).`)
  }
  if (!res.ok) {
    const e = body as Partial<ApiErrorBody>
    throw new ApiError(res.status, e.error ?? 'internal-error', e.message ?? `HTTP ${res.status}`)
  }
  return { data: body as T, url: path, status: res.status, ms, raw: JSON.stringify(body, null, 2) }
}

export const api = {
  colombiaTime: (s?: AbortSignal) => get<ColombiaTime>('/api/v1/time/colombia', s),
  fibonacci: (n: number, s?: AbortSignal) => get<FibonacciResult>(`/api/v1/fibonacci/${n}`, s),
  capitals: (s?: AbortSignal) => get<CapitalsResult>('/api/v1/capitals/europe', s),
  capital: (country: string, s?: AbortSignal) =>
    get<Capital>(`/api/v1/capitals/europe/${encodeURIComponent(country.trim())}`, s),
  algorithms: (s?: AbortSignal) => get<AlgorithmsResult>('/api/v1/eurofibo/algorithms', s),
  run: (algorithm: AlgorithmId, n: number, s?: AbortSignal) =>
    get<EuroFiboResult>(`/api/v1/eurofibo/${algorithm}/${n}`, s),
}

export const N_MAX = 10000
