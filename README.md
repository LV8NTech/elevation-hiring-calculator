# Elevation hiring calculator — pre-existing dependency

This is the original Elevation/LV8N calculator, two fictional profiles, original calculator tests, and error helper. It is **not event-created work**. It is published separately so the HireSense event repository can pin it without importing the original application's history.

The original separate LV8N application is unchanged. See OWNER-NOTICE.md for owner authorization; no general third-party reuse license is invented.

Use Node 24 and pnpm 10. Run `pnpm install` then `pnpm test`. TypeScript source is consumed by HireSense's Vite/esbuild toolchain. Consumers must pin an immutable commit, not a moving branch.
