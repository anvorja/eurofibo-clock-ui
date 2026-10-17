import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { N_MAX } from '@/lib/api'

const STEPS: { title: string; body: ReactNode }[] = [
  {
    title: 'Elige una estrategia',
    body: 'A1, A2 y A3 son tres maneras distintas de convertir un número y la hora en una capital europea. La que está seleccionada se resalta en negro.',
  },
  {
    title: 'Escribe el índice n',
    body: (
      <>
        Es un entero entre 0 y {N_MAX.toLocaleString('es-CO')}. Para valores hasta 100 puedes usar la barra deslizante; para más, escribe el número.
      </>
    ),
  },
  {
    title: 'Pulsa Ejecutar',
    body: 'El servidor toma la hora actual de Bogotá, calcula y responde. Al cambiar de estrategia el cálculo se repite solo.',
  },
  {
    title: 'Lee la derivación',
    body: 'Cada fila del resultado es un paso: su nombre, la fórmula con tus números y el valor obtenido. Puedes repetir la cuenta a mano y comprobar que coincide.',
  },
]

const STRATEGIES: { id: string; name: string; text: string }[] = [
  {
    id: 'A1',
    name: 'Fibonacci Colombian Capital Selector',
    text: 'Compara dos números: la suma de hora + minutos + segundos, dividida entre n + fib(n). El resultado, módulo 5, apunta a una de las 5 capitales.',
  },
  {
    id: 'A2',
    name: 'Fibonacci Temporal Passport',
    text: 'Mezcla el reloj con Fibonacci en el European Temporal Score (ETS = hora × código + minutos + segundos). El ETS, módulo 5, elige la capital y se emite un código de pasaporte que puedes copiar.',
  },
  {
    id: 'A3',
    name: 'Viajero Temporal Europeo',
    text: 'Parte de una capital fijada por fib(n) y avanza tantas posiciones como indique el reloj (hora × minutos + segundos) sobre un catálogo circular de 10. Además de la capital final muestra todo el recorrido.',
  },
]

const TERMS: { term: string; meaning: string }[] = [
  { term: 'n', meaning: 'El número que tú eliges. Es la entrada de Fibonacci.' },
  { term: 'fib(n)', meaning: 'El enésimo número de Fibonacci (0, 1, 1, 2, 3, 5, 8…). Con n grande tiene miles de dígitos; la pantalla lo abrevia y puedes ver el valor completo en la respuesta cruda.' },
  { term: 'mod', meaning: 'El resto de una división. «13 mod 5 = 3». Sirve para dar la vuelta al catálogo: nunca te sales de la lista.' },
  { term: 'Índice de capital', meaning: 'La posición, empezando en 0, de la capital elegida dentro del catálogo circular.' },
  { term: 'Hora de Bogotá', meaning: 'Sale del servidor, no de tu navegador. Cambia cada segundo, así que el mismo n puede dar capitales distintas más tarde.' },
  { term: 'Respuesta cruda', meaning: 'La petición exacta al API y su JSON, para quien quiera verificar o copiar el dato.' },
]

const FAQ: { q: string; a: string }[] = [
  { q: '¿Por qué el mismo n me da otra capital?', a: 'Porque todas las estrategias usan la hora actual de Colombia. Si ejecutas dos veces en segundos distintos, el reloj cambió.' },
  { q: 'Dice «API sin conexión».', a: 'El servidor de EuroFibo Clock no responde. Comprueba que esté en marcha (por defecto en 127.0.0.1:8484) y pulsa Reintentar.' },
  { q: 'El campo n se pone en rojo.', a: `Solo se aceptan enteros de 0 a ${N_MAX.toLocaleString('es-CO')}. Sin decimales ni negativos.` },
  { q: '¿Por qué los países se buscan en inglés?', a: 'Así los guarda el catálogo del API: «Spain», no «España». No distingue mayúsculas.' },
]

const VIEWS: { id: string; label: string; text: string }[] = [
  { id: 'estrategias', label: 'Estrategias', text: 'Ejecuta A1, A2 o A3 y ve el cálculo paso a paso.' },
  { id: 'fibonacci', label: 'Fibonacci', text: 'Calcula fib(n) por sí solo, mientras escribes.' },
  { id: 'capitales', label: 'Capitales', text: 'Consulta el catálogo y busca la capital de un país.' },
]

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-6 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium tracking-[-0.025em]">
      {children}
    </h2>
  )
}

export function GuideView() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-16">
      <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.035em]">Cómo usar EuroFibo</h1>
      <p className="mt-6 max-w-[52ch] text-[18px] leading-[1.55] text-soft">
        Una página para entender qué hace cada pantalla y cómo leer el resultado. Se lee en dos minutos.
      </p>

      <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-16 lg:col-span-7">
          <section aria-labelledby="g-pasos">
            <Heading id="g-pasos">Primeros pasos</Heading>
            <ol className="space-y-2">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-4 rounded-xl bg-field p-5">
                  <span className="font-mono text-[15px] text-soft tnum">{i + 1}</span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="mt-1 text-[15px] leading-[1.5] text-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="g-estrategias">
            <Heading id="g-estrategias">Las tres estrategias</Heading>
            <ul className="space-y-2">
              {STRATEGIES.map((s) => (
                <li key={s.id} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-xl bg-field p-5">
                  <span className="font-mono text-[15px] tnum">{s.id}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-1 text-[15px] leading-[1.5] text-soft">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="g-ejemplo">
            <Heading id="g-ejemplo">Un ejemplo con A2</Heading>
            <div className="rounded-2xl bg-field p-6 sm:p-8">
              <p className="text-[15px] leading-[1.55] text-soft">
                Ilustrativo: con <span className="font-mono text-ink">n = 5</span> y la hora <span className="font-mono text-ink">14:30:20</span>.
                Tu pantalla usará la hora real.
              </p>
              <ol className="mt-5 space-y-3 font-mono text-[14px] leading-6">
                <li><span className="text-soft">fib(5)</span> = 5</li>
                <li><span className="text-soft">código Fibonacci</span> = 5 + 5 = 10</li>
                <li><span className="text-soft">ETS</span> = 14 × 10 + 30 + 20 = 190</li>
                <li><span className="text-soft">índice</span> = 190 mod 5 = 0 → la primera capital del catálogo</li>
              </ol>
              <p className="mt-5 text-[15px] leading-[1.55] text-soft">
                Es la misma cuenta que verás en la tabla «Derivación», con tus valores.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-16 lg:col-span-5">
          <section aria-labelledby="g-pantallas">
            <Heading id="g-pantallas">Las pantallas</Heading>
            <ul className="rounded-xl bg-field">
              {VIEWS.map((v, i) => (
                <li key={v.id} className={i > 0 ? 'border-t border-paper' : ''}>
                  <a href={`#${v.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-field-2">
                    <span className="min-w-0">
                      <span className="block font-medium">{v.label}</span>
                      <span className="block text-[15px] text-soft">{v.text}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[15px] leading-[1.5] text-soft">
              El punto junto a la hora en la barra superior indica si el API responde: verde conectado, rojo sin conexión.
            </p>
          </section>

          <section aria-labelledby="g-glosario">
            <Heading id="g-glosario">Glosario</Heading>
            <dl className="space-y-4">
              {TERMS.map((t) => (
                <div key={t.term}>
                  <dt className="font-mono text-[15px]">{t.term}</dt>
                  <dd className="mt-0.5 text-[15px] leading-[1.5] text-soft">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="g-faq">
            <Heading id="g-faq">Si algo no cuadra</Heading>
            <div className="space-y-2">
              {FAQ.map((f) => (
                <details key={f.q} className="group rounded-xl bg-field">
                  <summary className="cursor-pointer list-none px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">{f.q}</summary>
                  <p className="px-5 pb-4 text-[15px] leading-[1.5] text-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
