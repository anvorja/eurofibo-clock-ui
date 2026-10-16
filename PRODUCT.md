# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Brief-specified: TypeScript, pnpm, Vite + React, Tailwind CSS v4, TanStack Query, Motion. Inferred (not interviewed): the user asked for the work to be done end to end, so no question round was run.

## Users

Inferred: developers and reviewers of the EuroFibo Clock service (a Scala 3 hexagonal-architecture exercise) who want to call its API and understand how each strategy reaches its answer. They sit at a desk, in daylight, switching between the UI and the Swagger docs.

## Product Purpose

A frontend interface to the EuroFibo Clock HTTP API (`http://127.0.0.1:8484`). It lets a person run the three strategies (A1 Fibonacci Colombian Capital Selector, A2 Fibonacci Temporal Passport, A3 Viajero Temporal Europeo) for an index `n`, see the European capital chosen, and read the arithmetic that produced it. It also exposes the base use cases: Colombia time, Fibonacci of n, and the European capital catalogue. Success: someone can run any endpoint and verify the result by hand from what the screen shows.

## Positioning

The only view that shows the *derivation*: every value the API returns (fibonacci factor, temporal factor, raw index, ETS, displacement) is laid out as the step it belongs to, next to the raw JSON.

## Operating Context

The API has no CORS headers, so the UI reaches it through a same-origin dev proxy. The server uses the real clock of America/Bogota, so the same `n` gives different answers over time. Fibonacci values are returned as strings and can reach thousands of digits (n up to 10000).

## Capabilities and Constraints

- Endpoints: `GET /api/v1/time/colombia`, `/fibonacci/{n}`, `/capitals/europe`, `/capitals/europe/{country}`, `/eurofibo/algorithms`, `/eurofibo/{a1|a2|a3}/{n}`.
- `n` is an integer in [0, 10000]; errors return `{error, message}` with HTTP 400.
- A1 and A2 use a 5-capital catalogue; A3 uses 10 and returns a circular `path`.
- The UI is read-only: no mutation endpoints exist.
- Undecided: deployment target and production API base URL.

## Brand Commitments

The user pinned the visual reference: the look of scale.com (Scale AI). Inspiration only: no Scale logo, copy or assets are reused.

## Evidence on Hand

`eurofibo-clock/README.md`, `eurofibo-clock/scala-servicio.pdf`, `eurofibo-clock/src/main/resources/openapi/openapi.yaml`. No customers, benchmarks or testimonials exist and none may be invented.

## Product Principles

- Show the derivation, not just the answer.
- The server is the source of truth: never recompute business logic in the browser; only lay out what the API returns.
- Errors name the problem the API reported and how to recover.
- Everything the API can do is reachable in two interactions.

## Accessibility & Inclusion

Inferred: WCAG AA contrast, full keyboard operation, reduced-motion respected. Interface language is Spanish, matching the README and PDF; API terms (A1, A2, A3, passport code) stay as the API names them.
