# Dynamic Sites — one-repository instructions

This repository is the single source of truth for the Dynamic Sites website and resource catalog.

## Run the website

```bash
npm install
npm run lint
npm run build
npm run dev
```

The React + TypeScript + Vite website reads its live catalog from `src/data.ts` and `src/externalData.ts`.

## Catalog files

- `src/data.ts` — the website’s core resources and catalog model.
- `src/externalData.ts` — external collection and Codrops records displayed by the website.
- `catalog/core-resources.json` — 87 individual core records: 65 prompts, 12 backgrounds/shaders, and 10 interactions.
- `catalog/external-collections.json` — external collection-level records.
- `sources/codrops-seed.original.json` — Codrops seed records with source links and license status.
- `catalog/sources.json` — all approved external source URLs grouped by category.
- `catalog/resource.schema.json` — metadata schema for future item-level imports.
- `catalog/counts.json` — inventory counts and provenance.

## Current counts

The website currently displays 107 individual cards:

- 65 core prompts
- 12 core background/shader resources
- 10 core interactions
- 10 external collection records
- 10 Codrops records

The catalog inventory identifies approximately 13,020 units across the wider external collections. Those 13,020 units are not yet all represented as separate item-level JSON records. Collection counts must not be presented as individual imported records until item-level manifests have been collected, deduplicated, and license-verified.

## Import rules

When adding item-level resources:

1. Deduplicate by canonical source URL, asset ID, and normalized title.
2. Preserve title, type, category, technologies, description, prompt, code status, install command, live URL, source URL, tutorial URL, asset URL, exact license, attribution, commercial-use status, redistribution status, and verification date.
3. Copy raw code or assets only when the source license clearly allows it and preserve the license notice.
4. For unclear licenses, store the metadata and source links but do not copy raw code, media, models, or assets.
5. Keep external resources marked as external; do not represent external creators or repositories as belonging to Dynamic Sites.
6. After catalog changes, run lint, build, route smoke tests, and desktop/mobile checks before pushing.

## Repository policy

This repository is private and is the only intended GitHub backup for the project. Netlify deployment remains separate and must not be performed until explicitly requested.
