# Deployments: psychology vs nursing vs VCE

This repository contains **one Next.js app** that can ship **either** the psychology (NPPE) product **or** the nursing product, controlled at **build time** with `NEXT_PUBLIC_EXAM_SUITE`. That keeps domains, middleware, content APIs, and marketing pages from leaking the wrong exam.

## VCE English

**Not in this app.** The VCE product lives in **`../vce-english-app`** (separate Next.js project, separate Vercel project, separate git history if you split repos). Do not point VCE domains at `psychology-exam-app` or `nursing-exam-app`.

## Vercel projects (recommended)

| Vercel project        | Environment variable              | Purpose                                      |
|-----------------------|-----------------------------------|----------------------------------------------|
| `psychology-exam-app` | `NEXT_PUBLIC_EXAM_SUITE=psychology` | NPPE: `/psych/*`, blog, psych content API only |
| `nursing-exam-app`    | `NEXT_PUBLIC_EXAM_SUITE=nursing`    | Nursing: `/nursing/*`, nursing landing, no NPPE blog |

Use the **production URL that Vercel assigns to that project** (e.g. `psychology-exam-app.vercel.app`) as **`NEXTAUTH_URL`** so magic links and Auth.js cookies match the hostname users open.

Avoid reusing one vanity domain (e.g. `psych-exam.vercel.app`) across different projects unless that alias is explicitly assigned to the correct project in the Vercel dashboard.

## Local development

Omit the variable or set `NEXT_PUBLIC_EXAM_SUITE=all` (default) to use **both** products: `/psych/dashboard`, `/nursing/dashboard`, and shared APIs.

## Build commands

```bash
# Psychology-only production build
NEXT_PUBLIC_EXAM_SUITE=psychology npm run build

# Nursing-only production build
NEXT_PUBLIC_EXAM_SUITE=nursing npm run build
```

On Vercel, set `NEXT_PUBLIC_EXAM_SUITE` in **Project → Settings → Environment Variables** for Production (and Preview if you use previews per product).

## What each suite blocks

- **`psychology`**: `/nursing` routes and `productLine=nursing` on `/api/content/*` return 404.
- **`nursing`**: `/psych` routes, all `/blog` routes (NPPE content), and `productLine=psychology` on content APIs return 404. Public home is the nursing marketing page.

Internal rewrite target `/suite-not-found` is excluded from auth middleware so users get a normal 404, not a sign-in wall.
