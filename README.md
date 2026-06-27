# Steps Budget

A clean, fluid personal budgeting web app — think Rocket Money, simplified. Built with React + Vite + Tailwind. Works beautifully on **mobile, tablet, and desktop**, ships with **10 themes**, and stores everything privately in the browser (no account needed).

## Features

- **Dashboard** — total balance, monthly income/spending, income-vs-spending bar chart, spending-by-category donut, upcoming bills, recent activity.
- **Activity** — add / edit / delete transactions, search, filter by income/expense, grouped by date with category tags.
- **Budgets** — set a monthly limit per category with live progress bars and over-budget warnings.
- **Recurring** — track subscriptions & bills with cycle, next-due countdown, and estimated monthly cost.
- **Themes** — a dedicated tab with 10 themes (Midnight, Daylight, Forest, Sunset, Ocean, Sand, Grape, Mono, Carbon, Rose Gold). Each has a live preview and applies instantly across the whole app.

## Local-first, backend-ready

All data lives in `localStorage` via a single adapter at `src/data/storage.js`. Every method is already `async`, so moving to a real backend (e.g. Supabase) later means reimplementing only that one file — the rest of the app is untouched.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy to GitHub Pages

1. Create a repo and push this folder.
2. The included `gh-pages` script publishes the `dist/` build:

   ```bash
   npm run build
   npm run deploy
   ```

3. In your repo Settings → Pages, set the source to the `gh-pages` branch.

`vite.config.js` uses `base: './'` so it works under any repo name without extra configuration. (For a different host like Netlify or Vercel, just point it at this folder — no config needed.)

## Project structure

```
src/
  App.jsx                # routing + providers
  main.jsx               # entry
  index.css              # Tailwind + theme CSS variables
  components/
    Layout.jsx           # responsive sidebar + bottom nav
    ui.jsx               # buttons, inputs, cards, modal, etc.
  context/
    ThemeContext.jsx     # active theme + persistence
    BudgetContext.jsx    # all app data + mutations
  data/
    storage.js           # the ONLY persistence layer (swap for a backend)
    seed.js              # first-run sample data
    utils.js             # formatting + calculations
  pages/
    Dashboard.jsx  Transactions.jsx  Budgets.jsx  Recurring.jsx  Themes.jsx
  themes/
    themes.js            # all 10 theme definitions
```

## Adding a theme

Add an object to the array in `src/themes/themes.js` — it appears in the Themes tab automatically.
