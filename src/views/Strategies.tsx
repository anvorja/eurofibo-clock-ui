import { useMutation, useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api, N_MAX, type AlgorithmDescriptor, type AlgorithmId, type Capital } from '@/lib/api'
import { cn } from '@/lib/cn'
import { outcomeOf, type Outcome } from '@/lib/derivation'
import { abbreviate } from '@/lib/format'
import { Button, CopyButton, ErrorNotice, RawResponse, Skeleton } from '@/components/ui'

const clampN = (v: number) => Math.min(N_MAX, Math.max(0, Math.trunc(v)))

export function Strategies() {
  const algorithms = useQuery({ queryKey: ['algorithms'], queryFn: ({ signal }) => api.algorithms(signal) })
  const capitals = useQuery({ queryKey: ['capitals'], queryFn: ({ signal }) => api.capitals(signal) })
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('a2')
  const [raw, setRaw] = useState('5')
  const run = useMutation({ mutationFn: (v: { a: AlgorithmId; n: number }) => api.run(v.a, v.n) })

  const n = raw.trim() === '' ? NaN : Number(raw)
  const valid = Number.isInteger(n) && n >= 0 && n <= N_MAX
  const descriptor = algorithms.data?.data.algorithms.find((a) => a.id === algorithm)

  const resultRef = useRef<HTMLElement>(null)
  const execute = (a = algorithm, value = n, reveal = false) => {
    if (!(Number.isInteger(value) && value >= 0 && value <= N_MAX)) return
    run.mutate({ a, n: value })
    // En pantallas de una columna el resultado queda debajo del formulario: se lleva a la vista.
    if (reveal && window.matchMedia('(max-width: 1023px)').matches) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Primera ejecución al abrir la vista, para que nunca haya una pantalla vacía.
  const started = useRef(false)
  useEffect(() => {
    if (!started.current) {
      started.current = true
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-10 pb-24 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:pt-16">
      <section aria-labelledby="titulo" className="lg:col-span-5">
        <h1 id="titulo" className="max-w-[14ch] text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em]">
          Una capital, elegida por el reloj
        </h1>
        <p className="mt-6 max-w-[44ch] text-[18px] leading-[1.55] text-soft">
          Fibonacci y la hora de Colombia deciden un destino europeo. Elige la estrategia, un índice <span className="font-mono text-ink">n</span> y lee cada paso del cálculo.{' '}
          <a href="#guia" className="text-ink underline underline-offset-4 hover:no-underline">¿Cómo se lee?</a>
        </p>

        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault()
            execute(algorithm, n, true)
          }}
        >
          <fieldset>
            <legend className="mb-3 text-[15px] font-medium">Estrategia</legend>
            {algorithms.isPending && (
              <div className="space-y-2">
                <Skeleton className="h-[72px]" /> <Skeleton className="h-[72px]" /> <Skeleton className="h-[72px]" />
              </div>
            )}
            {algorithms.isError && <ErrorNotice error={algorithms.error} onRetry={() => algorithms.refetch()} />}
            <div className="grid gap-2">
              {algorithms.data?.data.algorithms.map((a) => (
                <AlgorithmOption
                  key={a.id}
                  a={a}
                  selected={a.id === algorithm}
                  onSelect={() => {
                    setAlgorithm(a.id)
                    if (valid) execute(a.id)
                  }}
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-8">
            <label htmlFor="n" className="mb-3 flex items-baseline justify-between text-[15px] font-medium">
              Índice n
              <span className="font-normal text-soft">0 – {N_MAX.toLocaleString('es-CO')}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                id="n"
                inputMode="numeric"
                autoComplete="off"
                value={raw}
                aria-invalid={!valid}
                aria-describedby="n-help"
                onChange={(e) => setRaw(e.target.value.replace(/[^\d-]/g, ''))}
                className={cn(
                  'h-14 w-36 rounded-lg bg-field px-4 font-mono text-[22px] tnum outline-none',
                  'transition-shadow duration-200 focus-visible:shadow-[inset_0_0_0_2px_var(--color-ink)]',
                  !valid && 'shadow-[inset_0_0_0_2px_var(--color-danger)]',
                )}
              />
              <input
                type="range"
                min={0}
                max={100}
                aria-label="Ajuste rápido de n entre 0 y 100"
                value={valid ? Math.min(n, 100) : 0}
                onChange={(e) => setRaw(String(clampN(Number(e.target.value))))}
                className="h-10 min-w-0 flex-1"
              />
            </div>
            <p id="n-help" className={cn('mt-2 min-h-6 text-[14px]', valid ? 'text-soft' : 'text-danger')}>
              {valid ? 'Entero. Para valores mayores a 100 escribe el número.' : `Escribe un entero entre 0 y ${N_MAX.toLocaleString('es-CO')}.`}
            </p>
          </div>

          <Button type="submit" disabled={!valid || run.isPending || !descriptor} className="mt-4 w-full sm:w-auto">
            {run.isPending ? 'Calculando…' : 'Ejecutar'}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </form>
      </section>

      <section ref={resultRef} aria-labelledby="resultado" aria-live="polite" className="min-w-0 scroll-mt-20 lg:col-span-7">
        <h2 id="resultado" className="sr-only">Resultado</h2>
        {run.isError && <ErrorNotice error={run.error} onRetry={() => execute()} />}
        {run.isPending && !run.data && <ResultSkeleton />}
        {descriptor && run.data && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${run.data.url}-${run.submittedAt}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: run.isPending ? 0.5 : 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Result
                outcome={outcomeOf(run.data.data, descriptor.catalogueSize)}
                descriptor={descriptor}
                catalogue={capitals.data?.data.capitals}
                trace={run.data}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}

function AlgorithmOption({ a, selected, onSelect }: { a: AlgorithmDescriptor; selected: boolean; onSelect: () => void }) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 rounded-xl p-4 transition-colors duration-200',
        selected ? 'bg-ink text-paper' : 'bg-field hover:bg-field-2',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
      )}
    >
      <input type="radio" name="algorithm" value={a.id} checked={selected} onChange={onSelect} className="sr-only" />
      <span className="mt-0.5 w-8 shrink-0 font-mono text-[15px] uppercase tnum">{a.id}</span>
      <span className="min-w-0">
        <span className="block font-medium">{a.name}</span>
        <span className={cn('mt-0.5 block text-[14px] leading-[1.45]', selected ? 'text-paper/75' : 'text-soft')}>{a.businessQuestion}</span>
      </span>
      <span className={cn('ml-auto shrink-0 pt-0.5 font-mono text-[13px] tnum', selected ? 'text-paper/75' : 'text-soft')}>{a.catalogueSize} capitales</span>
    </label>
  )
}

function Result({
  outcome,
  descriptor,
  catalogue,
  trace,
}: {
  outcome: Outcome
  descriptor: AlgorithmDescriptor
  catalogue?: Capital[]
  trace: Parameters<typeof RawResponse>[0]['trace']
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-accent px-6 py-8 text-paper sm:px-10 sm:py-12">
        <p className="text-[15px] text-paper/75">
          {descriptor.name} · hora de Bogotá <span className="font-mono tnum">{outcome.clock}</span>
        </p>
        <p className="mt-5 text-[clamp(3rem,9vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em] break-words">{outcome.capital.capital}</p>
        <p className="mt-3 text-[22px] text-paper/85">{outcome.capital.country}</p>
        {outcome.passport && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-mono text-[15px] break-all tnum">{outcome.passport}</p>
            <span className="text-paper [&_button]:text-paper">
              <CopyButton text={outcome.passport} label="Copiar pasaporte" />
            </span>
          </div>
        )}
      </div>

      {outcome.path ? <Journey path={outcome.path} /> : catalogue && <Catalogue capitals={catalogue} index={outcome.index} />}

      <div>
        <h3 className="mb-3 text-[18px] font-medium">Derivación</h3>
        <ol className="rounded-xl bg-field">
          {outcome.steps.map((s, i) => (
            <li key={s.label} className={cn('grid gap-x-6 gap-y-1 px-5 py-4 sm:grid-cols-[1fr_1.3fr_8rem] sm:items-baseline', i > 0 && 'border-t border-paper')}>
              <span className="font-medium">{s.label}</span>
              <span className="font-mono text-[14px] break-words text-soft">{s.formula}</span>
              <span className="font-mono text-[17px] tnum sm:text-right" title={s.value}>
                {abbreviate(s.value)}
                {s.capital && <span className="font-sans text-[15px] text-accent"> → {s.capital.capital}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <RawResponse trace={trace} />
    </div>
  )
}

function Catalogue({ capitals, index }: { capitals: Capital[]; index: number }) {
  return (
    <div>
      <h3 className="mb-3 text-[18px] font-medium">Catálogo circular</h3>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {capitals.map((c, i) => (
          <li key={c.capital} className={cn('rounded-xl px-4 py-4 transition-colors duration-300', i === index ? 'bg-ink text-paper' : 'bg-field')}>
            <span className={cn('font-mono text-[13px] tnum', i === index ? 'text-paper/75' : 'text-soft')}>{i}</span>
            <span className="mt-1 block font-medium">{c.capital}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Journey({ path }: { path: Capital[] }) {
  return (
    <div>
      <h3 className="mb-3 text-[18px] font-medium">Recorrido · {path.length} paradas</h3>
      <ol className="flex flex-wrap gap-2">
        {path.map((c, i) => {
          const end = i === 0 || i === path.length - 1
          return (
            <li key={`${c.capital}-${i}`} className={cn('rounded-full px-4 py-2 text-[15px]', end ? 'bg-ink text-paper' : 'bg-field')}>
              {c.capital}
              {i === 0 && <span className="ml-2 text-paper/70">salida</span>}
              {i === path.length - 1 && i !== 0 && <span className="ml-2 text-paper/70">destino</span>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-20" />
      <Skeleton className="h-64" />
    </div>
  )
}
