# Clampy Improvement Backlog

This file tracks follow-up enhancements that are **not blocking** current functionality but should be prioritized to keep the codebase healthy.

## 1) Migrate deprecated Sass APIs
- Replace all `@import` with `@use` / `@forward`.
- Replace global built-ins:
  - `type-of(...)` -> `meta.type-of(...)`
  - `unitless(...)` -> `math.is-unitless(...)`
- Replace slash division (`a / b`) with `math.div(a, b)` outside `calc()`.

### Why
Current builds emit extensive Dart Sass deprecation warnings. Future Sass major versions will break these patterns.

---

## 2) Add automated tests for breakpoint editing flows
- Add component/integration tests for:
  - editing default breakpoint -> creating override
  - editing override repeatedly
  - deleting override restores default row
  - category/icon updates when width changes

### Why
Recent bugs were in these paths. Tests would prevent regressions.

---

## 3) Add type-safety for form and breakpoint models
- Introduce TypeScript or runtime model validation helpers for:
  - clamp form payload
  - breakpoint entries
  - URL serialization shape

### Why
Would prevent accidental property mismatches and stale-field bugs.

---

## 4) Add CI quality gates
- Add CI jobs for `npm run lint` and `npm run build`.
- Optionally add test job once baseline tests are added.

### Why
Ensures regressions are detected before merge.
