# Oriz-Travel

## Cursor Cloud specific instructions

This repo is a single **Next.js 14 (App Router)** front-end app (`oriz-travel`). It is a self-contained client-side prototype: all flight/hotel/car/tour data is hardcoded in `app/page.jsx`. There is **no backend, database, env vars, or external service** to wire up.

### Services
- **Next.js dev server** (the only service): `npm run dev` → serves on `http://localhost:3000`. Hot reload is enabled.

### Common commands
- Install deps: `npm install` (no lockfile is committed; it gets generated on install).
- Dev: `npm run dev`
- Build (also runs Next.js lint + type checks): `npm run build`
- Serve production build: `npm run start`
- There is **no separate `lint` script**; linting runs as part of `npm run build`.

### Notes / gotchas
- Node 18.17+ is required by Next.js 14; the VM has Node 22 which works fine.
- In dev mode the Next.js error overlay may show a "1 error" indicator from a client-side console error in the existing page code. This is pre-existing and **does not break functionality** — the booking engine and flight search work correctly. Do not treat it as an environment setup failure.
