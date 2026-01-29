# KI Norge Portal

Portal for kunstig intelligens i norsk offentlig sektor.

## Tech Stack

### Backend / CMS
- **Strapi v5.33.4** - Headless CMS (self-hosted, Node.js)
- **SQLite** - Database for development (file-based, `.tmp/data.db`)
- **PostgreSQL** - Recommended for production
- **better-sqlite3** - Native SQLite bindings for Node.js
- **Knex.js** - SQL query builder (used by Strapi internally)
- **Koa.js** - Web framework (Strapi's underlying server)
- **Node.js v20** - Runtime requirement

### API
- **REST API** - Strapi's built-in REST endpoints (`/api/artikkels`, etc.)
- **Strapi Document Service** - v5's new content API
- **Public permissions** - Configured via bootstrap script (no auth needed for reads)

### Frontend
- **Deno 2** - Runtime (replaces Node.js for frontend)
- **Astro v5** - Static site generator
- **React 19** - Component library (via Astro integration)
- **Designsystemet v1.11** - Digdir's design system (`@digdir/designsystemet-react`)
- **TypeScript** - Type safety (native in Deno)

### Monorepo / Tooling
- **pnpm** - Package manager for CMS only
- **Deno** - Runtime + package manager for frontend
- **pnpm-workspace.yaml** - CMS workspace configuration

### Hosting
- **Self-hosted** - No vendor lock-in
- **Static export** - Frontend builds to static HTML
- **Strapi server** - Needs Node.js hosting (Docker, VM, etc.)

## Project Structure

```
ki.norge.no/
├── apps/
│   ├── cms/                 # Strapi v5 CMS
│   │   ├── config/          # Strapi configuration
│   │   ├── src/
│   │   │   ├── api/         # Content types (artikkel, side, eksempel, etc.)
│   │   │   └── components/  # Block components (advarsel, lenke, etc.)
│   │   └── .tmp/data.db     # SQLite database (dev)
│   └── frontend/            # Astro frontend
│       ├── src/
│       │   ├── components/  # Astro/React components
│       │   ├── pages/       # Routes
│       │   └── lib/         # Strapi client, utilities
│       └── public/          # Static assets
├── dokumentasjon/           # Project documentation
├── pnpm-workspace.yaml      # Monorepo config
└── package.json
```

## Development

### Prerequisites
- Node.js v20+ (for CMS only)
- pnpm (for CMS only)
- Deno 2+ (for frontend)

### Setup

**CMS:**
```bash
cd apps/cms
pnpm install
```

**Frontend:**
```bash
cd apps/frontend
deno install --allow-scripts
```

### Start Development Servers

**Terminal 1 - CMS (Strapi):**
```bash
cd apps/cms
pnpm develop
```
Admin panel: http://localhost:1337/admin

**Terminal 2 - Frontend (Astro/Deno):**
```bash
cd apps/frontend
deno task dev
```
Frontend: http://localhost:4321

### Important: Static Site Architecture

The frontend is a **static site generator**. Pages are pre-rendered with content fetched from Strapi at build time.

**In development:**
- Changes in Strapi admin won't appear immediately
- Restart the frontend dev server to see CMS changes
- Or trigger a page reload by saving a frontend file

**In production:**
- Run `deno task build` in `apps/frontend` to rebuild with latest CMS content
- Consider webhook-triggered rebuilds when CMS content changes

## Content Types

| Type | API Endpoint | Description |
|------|--------------|-------------|
| Artikkel | `/api/artikkels` | News articles |
| Side | `/api/sides` | Static pages |
| Eksempel | `/api/eksempels` | Case studies |
| Veiledning | `/api/veilednings` | Guidance docs |
| FAQ | `/api/faqs` | FAQ items |
| Merkelapp | `/api/merkelapps` | Tags/categories |

## Content Architecture

Overview of what's controlled by Strapi (editorial content) vs code (structure/layout):

| Page | Strapi-controlled | Code-controlled |
|------|-------------------|-----------------|
| `/` (homepage) | Articles (News), Veiledninger (Resources) | Layout, Hero, Stats, Pillars, TargetAudiences |
| `/artikler` | Article list | Page layout |
| `/artikler/[slug]` | Article content (blocks) | Page template |
| `/eksempler` | Example list | Page layout |
| `/eksempler/[slug]` | Example content (blocks) | Page template |
| `/eksempler/send-inn` | - | Entire page (form) |
| `/veiledning` | Veiledning list | Page layout |
| `/veiledning/[slug]` | Veiledning content (blocks) | Page template |
| `/faq` | FAQ items | Page layout |
| `/kontakt` | Page content (blocks) | Page template |
| `/om-oss` | Page content (blocks) | Page template |
| `/sandkasse` | Page content (blocks) | Page template |
| `/sandkasse/prosjekter` | - | Placeholder (future Altinn) |
| `/sandkasse/prosjekter/[slug]` | - | Placeholder (future Altinn) |

**Principle:** Editorial content lives in Strapi. Page structure, navigation, and design live in code.

## Environment Variables

### CMS (`apps/cms/.env`)
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generated>
ADMIN_JWT_SECRET=<generated>
API_TOKEN_SALT=<generated>
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Frontend (`apps/frontend/.env`)
```
STRAPI_URL=http://localhost:1337
PREVIEW_SECRET=<shared-secret-with-cms>
```

## Preview Mode

Editors can preview draft content before publishing:

1. In Strapi admin, click "Open preview" on any content item
2. This opens the frontend with a preview banner showing draft content
3. Click "Avslutt forhåndsvisning" to exit preview mode

**Configuration:**
- Set matching `PREVIEW_SECRET` in both CMS and frontend `.env` files
- Preview uses the Strapi Document Service `status=draft` parameter
