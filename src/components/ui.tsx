import { Check, Copy, TriangleAlert } from 'lucide-react'
import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { ApiError, type Traced } from '@/lib/api'
import { cn } from '@/lib/cn'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-paper',
        'transition-[background-color,transform,opacity] duration-200 ease-out-expo',
        'hover:bg-accent active:scale-[0.97] disabled:bg-field-2 disabled:text-soft disabled:active:scale-100',
        className,
      )}
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-sm bg-field-2', className)} />
}

export function ErrorNotice({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const e = error instanceof ApiError ? error : null
  const title =
    e?.kind === 'network'
      ? 'Sin conexión con el API'
      : e?.kind === 'domain-error'
        ? 'El dominio rechazó la entrada'
        : e?.kind === 'invalid-request'
          ? 'Petición inválida'
          : 'Error inesperado'
  return (
    <div role="alert" className="flex gap-4 rounded-xl bg-danger-tint p-5 text-danger">
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="font-medium">{title}</p>
        <p className="mt-1 break-words text-[15px]">{e?.message ?? 'Algo falló al procesar la respuesta.'}</p>
        {e && e.status > 0 && <p className="mt-2 font-mono text-[13px]">HTTP {e.status} · {e.kind}</p>}
        {onRetry && (
          <button onClick={onRetry} className="mt-3 text-[15px] font-medium underline underline-offset-4 hover:no-underline">
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1600)
        } catch {
          /* portapapeles no disponible: sin efecto */
        }
      }}
      className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline-offset-4 hover:underline"
    >
      {done ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span aria-live="polite">{done ? 'Copiado' : label}</span>
    </button>
  )
}

/** La petición exacta y la respuesta cruda: lo que hace de esto una interfaz de API y no una maqueta. */
export function RawResponse({ trace, children }: { trace: Traced<unknown>; children?: ReactNode }) {
  return (
    <details className="group rounded-xl bg-field">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-medium">Respuesta cruda</span>
        <span className="font-mono text-[13px] text-soft tnum">
          GET {trace.url} · {trace.status} · {trace.ms} ms
        </span>
        <span className="ml-auto text-[15px] text-soft group-open:hidden">Ver</span>
        <span className="ml-auto hidden text-[15px] text-soft group-open:inline">Ocultar</span>
      </summary>
      <div className="px-5 pb-5">
        <pre className="max-h-96 overflow-auto rounded-lg bg-paper p-4 font-mono text-[13px] leading-6 break-all whitespace-pre-wrap">
          {trace.raw.length > 6000 ? `${trace.raw.slice(0, 6000)}\n… (${trace.raw.length} caracteres en total)` : trace.raw}
        </pre>
        <div className="mt-3 flex gap-5">
          <CopyButton text={trace.raw} label="Copiar JSON" />
          {children}
        </div>
      </div>
    </details>
  )
}
