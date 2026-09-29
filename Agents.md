# AGENTS.md

## Mission
Personal portfolio for Max Frenat, a cybersecurity student. Fast, distinctive, honest and original. It may share the general idea of an immersive 3D portfolio with other sites, but it must not reuse any other site's concept, layout, text or assets.

## Identity (given)
- Display name: Max Frenat (full name: Maximillian Delavega Adiwinata Frenat)
- Cybersecurity student, BINUS University, Jakarta, Indonesia
- Fortinet Certified Fundamentals (FCF) Cybersecurity, obtained Jul 2026
- GitHub: github.com/LKenzo
- Languages: Indonesian, English

## Source of truth for everything else
All other personal content (skills, tools, projects, education details, experience) lives in src/data/profile.ts and nowhere else. Build it only from (a) my GitHub, github.com/LKenzo, and (b) my CV, which I attach. Every entry has a `source` field: "cv" or "github:<repo>". If it is not in the CV or on my GitHub, it does not go on the site. Show me profile.ts for approval before any UI uses it. The base site ships only approved data; more is added later.

## Stack
Vite + TypeScript + Three.js. GSAP ScrollTrigger and Lenis for scroll are allowed; verify current package names first. Static output only: no backend, no runtime secrets, no third-party trackers. Self-host fonts and libraries (no CDN scripts). Import only the Three.js modules actually used.

## Design
- One memorable 3D hero; everything else quiet and disciplined.
- One coherent metaphor from hero through scroll and copy. The UI framing device must be original, not a HUD frame.
- Scroll traveler: one original 3D object moves along a curved path (CatmullRomCurve3) and follows smoothed scroll progress. Prefer procedural geometry; any downloaded asset must be CC0 or credited in the footer and README.
- Avoid template tells: identical rounded cards, gradient blobs, fade-in on everything, generic dark-plus-neon.
- Hero headline leads with my name.
- Works = short case studies built from my real repos (what it does, how, what I learned), using only what their READMEs and code support.
- Distinctive typography; all tokens as CSS custom properties.

## Quality gates
- Responsive from 360px, no horizontal scroll, semantic HTML, visible focus, alt text.
- prefers-reduced-motion and no-WebGL fallbacks that still look good.
- 3D: cap pixel ratio at 2, pause when off-screen, handle resize, dispose geometries/materials, lazy-load after first paint. Simplify the traveler and path on mobile.
- Lighthouse mobile >= 90 on Performance, Accessibility, Best Practices, SEO. Report measured numbers only; no unmeasured performance claims.

## Security
- No secrets, keys, CV, phone or address in the repo. .gitignore covers .env and dist.
- public/_headers from the first deploy commit: CSP (default-src 'self'; script-src 'self'; style-src 'self' unless the build provably needs more; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'), X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy.
- Contact = mailto link only. External links use rel="noopener". Lockfile committed, npm audit clean, current Node LTS.

## Testing
Put pure logic (scroll progress to stage/path position) in its own module and cover it with Vitest. Manual checklist for visuals.

## Git
Atomic commits, one concern each, conventional prefixes only: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Keep 3D code in its own module, separate from layout/UI. Add a real README (run, build, deploy) and a credits section.

## Process
Planning first; wait for my approval at each gate. After each milestone report what you built, what you would critique, and what I should test manually. No features beyond scope without asking.