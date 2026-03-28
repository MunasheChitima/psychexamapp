## [ERR-20260319-001] vitest_nextrequest_nexturl

**Logged**: 2026-03-19T16:21:00Z
**Priority**: medium
**Status**: pending
**Area**: tests

### Summary
Unit tests that cast `Request` to `NextRequest` may not include `nextUrl`.

### Error
```
TypeError: Cannot read properties of undefined (reading 'searchParams')
at resolveToken ... req.nextUrl.searchParams.get('token')
```

### Context
- Command: `npm run test:unit`
- Route test used `new Request(...) as NextRequest`
- Handler read `req.nextUrl` directly

### Suggested Fix
Use `new URL(req.url)` in route handlers for query parsing, or build explicit NextRequest test doubles with `nextUrl`.

### Metadata
- Reproducible: yes
- Related Files: src/app/api/study-data/guest/route.ts, src/app/api/study-data/guest/route.test.ts

---

## [ERR-20260319-002] vercel_cli_network_eaddrnotavail

**Logged**: 2026-03-19T06:38:26Z
**Priority**: high
**Status**: pending
**Area**: infra

### Summary
`vercel --prod --yes` failed from local machine due to network socket error.

### Error
```
Error: connect EADDRNOTAVAIL 35.186.247.156:443
```

### Context
- Command: `vercel --prod --yes`
- Working directory: `/Users/munashe/Documents/Coding Projects/APRAcademy/APRAcademy`
- Vercel CLI version: `48.6.6`

### Suggested Fix
Retry deployment after network stack recovers, or deploy via Git push to trigger Vercel remote build.

### Metadata
- Reproducible: unknown
- Related Files: none

---
