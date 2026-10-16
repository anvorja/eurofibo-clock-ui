# EuroFibo Clock UI

Interfaz web del servicio [`eurofibo-clock`](../eurofibo-clock) (Scala 3 · http4s). TypeScript, pnpm, Vite, React, Tailwind CSS v4, TanStack Query y Motion.

## Ejecutar

```bash
# 1. el API (otra terminal)
cd ../eurofibo-clock && sbt run          # http://127.0.0.1:8484

# 2. la interfaz
pnpm install
pnpm dev                                 # http://localhost:5173
```

El API no envía cabeceras CORS, así que `/api` pasa por el proxy de `vite.config.ts`. Para apuntar a otro host: `EUROFIBO_API=http://host:puerto pnpm dev`.

## Pantallas

- **Estrategias**: A1, A2 y A3 con `n`, resultado y derivación paso a paso.
- **Fibonacci**: `GET /api/v1/fibonacci/{n}`.
- **Capitales**: catálogo y búsqueda por país.

Cada resultado incluye la respuesta cruda del API. `PRODUCT.md` recoge el contexto de producto.
