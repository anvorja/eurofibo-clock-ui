import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { Footer } from '@/components/Footer'
import { Topbar, type ViewId } from '@/components/Topbar'
import { CapitalsView } from '@/views/CapitalsView'
import { FibonacciView } from '@/views/FibonacciView'
import { Strategies } from '@/views/Strategies'

const IDS: ViewId[] = ['estrategias', 'fibonacci', 'capitales']
const fromHash = (): ViewId => {
  const h = window.location.hash.slice(1) as ViewId
  return IDS.includes(h) ? h : 'estrategias'
}

export default function App() {
  const [view, setView] = useState<ViewId>(fromHash)
  useEffect(() => {
    const onHash = () => setView(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-20 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Saltar al contenido
      </a>
      <Topbar view={view} onView={setView} />
      <main id="contenido" className="flex-1">
        {view === 'estrategias' && <Strategies />}
        {view === 'fibonacci' && <FibonacciView />}
        {view === 'capitales' && <CapitalsView />}
      </main>
      <Footer />
      </div>
    </MotionConfig>
  )
}
