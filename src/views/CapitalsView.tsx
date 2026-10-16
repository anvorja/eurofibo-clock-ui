import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import { Button, ErrorNotice, RawResponse, Skeleton } from '@/components/ui'

export function CapitalsView() {
  const list = useQuery({ queryKey: ['capitals'], queryFn: ({ signal }) => api.capitals(signal) })
  const [input, setInput] = useState('Spain')
  const [country, setCountry] = useState('Spain')
  const one = useQuery({
    queryKey: ['capital', country],
    queryFn: ({ signal }) => api.capital(country, signal),
    enabled: country.trim() !== '',
    retry: false,
  })

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-16">
      <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em]">Capitales europeas</h1>
      <p className="mt-6 max-w-[52ch] text-[18px] text-soft">El catálogo base de cinco países que usan A1 y A2. A3 amplía el recorrido a diez capitales.</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <section aria-labelledby="catalogo" className="lg:col-span-7">
          <h2 id="catalogo" className="mb-3 text-[18px] font-medium">Catálogo</h2>
          {list.isPending && <Skeleton className="h-72" />}
          {list.isError && <ErrorNotice error={list.error} onRetry={() => list.refetch()} />}
          {list.data && (
            <>
              <ul className="rounded-xl bg-field">
                {list.data.data.capitals.map((c, i) => (
                  <li key={c.country} className={i > 0 ? 'border-t border-paper' : ''}>
                    <button
                      onClick={() => {
                        setInput(c.country)
                        setCountry(c.country)
                      }}
                      className="grid w-full grid-cols-[2rem_1fr_auto] items-baseline gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-field-2"
                    >
                      <span className="font-mono text-[13px] text-soft tnum">{i}</span>
                      <span className="text-[22px] font-medium tracking-[-0.02em]">{c.capital}</span>
                      <span className="text-[15px] text-soft">{c.country}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <RawResponse trace={list.data} />
              </div>
            </>
          )}
        </section>

        <section aria-labelledby="buscar" className="lg:col-span-5">
          <h2 id="buscar" className="mb-3 text-[18px] font-medium">Capital de un país</h2>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              setCountry(input)
            }}
          >
            <label htmlFor="country" className="sr-only">País, en inglés</label>
            <input
              id="country"
              value={input}
              autoComplete="off"
              onChange={(e) => setInput(e.target.value)}
              placeholder="France, germany…"
              className="h-12 min-w-0 flex-1 rounded-lg bg-field px-4 text-[17px] outline-none transition-shadow duration-200 focus-visible:shadow-[inset_0_0_0_2px_var(--color-ink)]"
            />
            <Button type="submit" disabled={input.trim() === ''}>
              Buscar <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>
          <p className="mt-2 text-[14px] text-soft">En inglés, sin distinguir mayúsculas.</p>

          <div className="mt-6 space-y-4" aria-live="polite">
            {one.isFetching && !one.data && <Skeleton className="h-40 rounded-2xl" />}
            {one.isError && <ErrorNotice error={one.error} />}
            {one.data && !one.isError && (
              <>
                <div className="rounded-2xl bg-accent px-6 py-8 text-paper">
                  <p className="text-[15px] text-paper/75">{one.data.data.country}</p>
                  <p className="mt-2 text-[clamp(2.5rem,6vw,4rem)] leading-none font-medium tracking-[-0.04em]">{one.data.data.capital}</p>
                </div>
                <RawResponse trace={one.data} />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
