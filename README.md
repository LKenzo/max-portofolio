# Max Frenat &mdash; Incident Response Dossier &amp; Portfolio

Personal portfolio and technical dossier for **Max Frenat**, a cybersecurity student at BINUS University specializing in defensive operations and digital forensics.

Designed as an official **Incident Response Dossier &amp; Chain-of-Custody Ledger**. All personal details, credentials, and projects are strictly derived from verified records in `src/data/profile.ts`.

---

## Technical Stack

- **Runtime &amp; Build:** [Vite](https://vitejs.dev/) with TypeScript (ES2022)
- **Styling:** Modular CSS custom properties (tokens), CSS Grid, and self-hosted WOFF2 fonts
- **Static Output:** Zero backend, zero runtime secrets, zero external CDN dependencies
- **Deployment Target:** [Cloudflare Pages](https://pages.cloudflare.com/)

---

## Getting Started

### Prerequisites

- Node.js `v20.x` or `v22.x` (Active LTS)
- npm `v10.x+`

### Installation

```bash
# Clone the repository
git clone https://github.com/LKenzo/Personal-Portofolio.git
cd Personal-Portofolio

# Install verified dependencies
npm install
```

### Local Development

```bash
npm run dev
```

Starts the local development server at `http://localhost:5173`.

### Production Build &amp; Preview

```bash
# Compile optimized static bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment (Cloudflare Pages)

1. Connect this repository to your Cloudflare dashboard under **Workers &amp; Pages** &rarr; **Create application** &rarr; **Pages**.
2. Configure build settings:
   - **Framework preset:** None / Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** Set environment variable `NODE_VERSION=22`
3. Deploy!

### Security &amp; CSP Verification Note

The repository includes [`public/_headers`](./public/_headers) which sets a strict Content Security Policy (`default-src 'self'`), `X-Content-Type-Options: nosniff`, and disables framing (`frame-ancestors 'none'`).

> [!NOTE]
> HTTP response headers configured in `_headers` are applied natively by **Cloudflare Pages** upon deployment. During local development via `vite dev`, headers should be verified against the deployed URL using `curl -I https://<your-subdomain>.pages.dev` or security testing tools (e.g., SecurityHeaders.com).

---

## Project Structure

```
├── public/
│   ├── _headers            # Cloudflare Pages strict CSP & security headers
│   ├── favicon.svg         # Cryptographic seal SVG icon
│   ├── robots.txt          # Search engine indexing configuration
│   └── fonts/              # Self-hosted Space Grotesk & JetBrains Mono WOFF2 fonts
├── src/
│   ├── data/
│   │   ├── types.ts        # TypeScript interfaces with strict DataSource typing
│   │   └── profile.ts      # Single source of truth for all portfolio data
│   ├── styles/
│   │   ├── tokens.css      # CSS variables for colors, spacing, and typography
│   │   ├── typography.css  # Self-hosted @font-face rules
│   │   └── dossier.css     # Responsive dossier grid and case-file cards
│   └── main.ts             # Client entry point and active section observer
├── index.html              # Semantic pre-rendered static HTML
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Credits &amp; Attribution

- **Typography:**
  - *Space Grotesk* by Florian Karsten (SIL Open Font License)
  - *JetBrains Mono* by JetBrains (Apache 2.0 License)
- **Concept:** Original Incident Response Dossier concept designed for Max Frenat.
