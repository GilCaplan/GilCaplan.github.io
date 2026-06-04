# gilcaplan.github.io

Personal website of **Gil Caplan** — Data Science & Engineering at the Technion.
A portfolio of AI / ML / agents / RAG and interactive data-visualization projects, where
each project is shown with a template suited to its type, and live ones can be used right
in the browser.

🔗 **Live:** https://gilcaplan.github.io

## Tech
Vite · React · TypeScript · Tailwind CSS · React Router. Deployed to GitHub Pages via
GitHub Actions.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Deploy
Push to `main` → the workflow in `.github/workflows/deploy.yml` builds and publishes to
GitHub Pages. (Repo **Settings → Pages → Source: GitHub Actions**.)

## Adding a project
Append one entry to [`src/data/projects.ts`](src/data/projects.ts) — set its `type`
(layout) and `interactivity` (`live` / `potential` / `showcase`). No other changes needed.

## Privacy
Live chatbots use a **visitor-supplied API key** that stays in the browser and is sent only
to the chosen model provider — this site has no backend and stores nothing.
