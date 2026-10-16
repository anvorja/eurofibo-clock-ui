import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api, N_MAX } from '@/lib/api'
import { cn } from '@/lib/cn'
import { abbreviate } from '@/lib/format'
import { CopyButton, ErrorNotice, RawResponse, Skeleton } from '@/components/ui'

export function FibonacciView() {
  const [raw, setRaw] = useState('90')
  const n = raw.trim() === '' ? NaN : Number(raw)
  const valid = Number.isInteger(n) && n >= 0 && n <= N_MAX
  const q = useQuery({
    queryKey: ['fibonacci', n],
    queryFn: ({ signal }) => api.fibonacci(n, signal),
    enabled: valid,
    retry: false,
    placeholderData: (prev) => prev,
  })
  const r = q.data?.data

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-16">
      <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em]">Fibonacci de n</h1>
      <p className="mt-6 max-w-[52ch] text-[18px] text-soft">
        Recursión de cola con acumuladores, calculada en el servidor. El valor llega como texto: con n = 10000 tiene más de dos mil dígitos.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <label htmlFor="fib-n" className="mb-3 block text-[15px] font-medium">Índice n</label>
          <input
            id="fib-n"
            inputMode="numeric"
            autoComplete="off"
            value={raw}
            aria-invalid={!valid}
            onChange={(e) => setRaw(e.target.value.replace(/[^\d-]/g, ''))}
            className={cn(
              'h-16 w-full rounded-lg bg-field px-5 font-mono text-[28px] tnum outline-none transition-shadow duration-200 focus-visible:shadow-[inset_0_0_0_2px_var(--color-ink)]',
              !valid && 'shadow-[inset_0_0_0_2px_var(--color-danger)]',
            )}
          />
          <p className={cn('mt-2 text-[14px]', valid ? 'text-soft' : 'text-danger')}>
            {valid ? 'Se calcula al escribir.' : `Escribe un entero entre 0 y ${N_MAX.toLocaleString('es-CO')}.`}
          </p>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-8" aria-live="polite">
          {q.isError && <ErrorNotice error={q.error} onRetry={() => q.refetch()} />}
          {q.isPending && valid && <Skeleton className="h-56 rounded-2xl" />}
          {r && q.data && (
            <>
              <div className="rounded-2xl bg-field px-6 py-8 sm:px-10 sm:py-10">
                <p className="text-[15px] text-soft">
                  fib({r.n}) · <span className="tnum">{r.digits.toLocaleString('es-CO')}</span> {r.digits === 1 ? 'dígito' : 'dígitos'}
                </p>
                <p className="mt-4 font-mono text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1.15] tracking-[-0.02em] break-all tnum" title={r.value}>
                  {r.value.length > 120 ? abbreviate(r.value, 60, 24) : r.value}
                </p>
                <div className="mt-6">
                  <CopyButton text={r.value} label="Copiar valor completo" />
                </div>
              </div>
              <RawResponse trace={q.data} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
