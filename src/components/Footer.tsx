import type { ReactNode } from 'react'

const LINKS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: 'LinkedIn de Carlos Andrés Borja',
    href: 'https://www.linkedin.com/in/carlos-andr%C3%A9s-borja-7bb853236/',
    icon: (
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    ),
  },
  {
    label: 'GitHub de anvorja',
    href: 'https://github.com/anvorja',
    icon: (
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
    ),
  },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-16">
        <div>
          <p className="text-[clamp(2rem,5vw,3.5rem)] leading-none font-medium tracking-[-0.035em]">EuroFibo Clock</p>
          <p className="mt-4 max-w-[44ch] text-[15px] text-paper/75">
            Fibonacci y la hora de Colombia eligen una capital europea.
          </p>
        </div>
        <div className="flex flex-col gap-4 lg:items-end">
          <ul className="flex gap-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.label}
                  title={l.label}
                  className="flex size-12 items-center justify-center rounded-full bg-paper/10 text-paper transition-[background-color,color,transform] duration-200 ease-out-expo hover:bg-paper hover:text-ink active:scale-95 focus-visible:outline-paper"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                    {l.icon}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[14px] text-paper/70">Carlos Andrés Borja · {YEAR}</p>
        </div>
      </div>
    </footer>
  )
}
