import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

export type ViewId = 'estrategias' | 'fibonacci' | 'capitales'

const NAV: { id: ViewId; label: string }[] = [
  { id: 'estrategias', label: 'Estrategias' },
  { id: 'fibonacci', label: 'Fibonacci' },
  { id: 'capitales', label: 'Capitales' },
]

/** La hora de Bogotá viene del servidor cada segundo; si falla, el estado del API se ve desde cualquier vista. */
function LiveClock() {
  const q = useQuery({ queryKey: ['clock'], queryFn: ({ signal }) => api.colombiaTime(signal), refetchInterval: 1000, retry: false })
  const online = q.isSuccess
  return (
    <p className="flex items-center gap-3 text-[14px] text-soft" role="status">
      <span aria-hidden className={cn('size-2 rounded-full', online ? 'bg-accent' : 'bg-danger')} />
      {online ? (
        <span>
          <span className="hidden sm:inline">Bogotá </span>
          <span className="hidden font-mono text-ink tnum sm:inline">{q.data.data.time.slice(0, 8)}</span>
          <span className="sr-only sm:hidden">API conectada</span>
        </span>
      ) : (
        <span className="sr-only text-danger sm:not-sr-only">API sin conexión</span>
      )}
    </p>
  )
}

export function Topbar({ view, onView }: { view: ViewId; onView: (v: ViewId) => void }) {
  return (
    <header className="sticky top-0 z-10 bg-paper/95 supports-[backdrop-filter]:bg-paper/90">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:gap-6 sm:px-8 lg:gap-12 lg:px-12">
        <a href="#estrategias" className="text-[17px] font-semibold tracking-[-0.02em] whitespace-nowrap" onClick={() => onView('estrategias')}>
          EuroFibo<span className="hidden sm:inline"> Clock</span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => onView(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              className={cn(
                'rounded-full px-2.5 py-1.5 text-[14px] sm:px-3 sm:text-[15px] transition-colors duration-200',
                view === item.id ? 'bg-field text-ink' : 'text-soft hover:text-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto">
          <LiveClock />
        </div>
      </div>
    </header>
  )
}
