# Team Spectator

A lightweight, mobile-first web app that shows a football team's roster with sorting and search. First target team: **DeSoto High School Football (DeSoto, Kansas)**. This is also a **portfolio project**, so code quality, tests, and documentation matter.

## Decisions already made

- **Web app, not native.** Started as an iOS/Android app idea, then changed to a lightweight web app.
- **React + TypeScript**, built with **Vite**.
- **Roster data lives in a JSON file** (`public/roster.json`), generated from a CSV by a build script. No database and no backend.
- **Fixed roster for a single team.** There is no roster upload feature and no admin UI for now.
- **PWA support** so fans can "Add to Home Screen" and the roster loads offline (bad reception at stadiums). Use `vite-plugin-pwa`.
- **Client-side only.** Search and sort are plain array operations in the browser.

## Features (v1)

**Player fields shown:** jersey number, name, height and weight, football position.

**Sorting** by: jersey number, name, height, weight, position. Tapping the active sort flips ascending/descending.

**Search bar** looks up players by:
- Name: case-insensitive, partial match
- Jersey number: exact or prefix match (typing "1" shows 1, 10 through 19, etc.)

## Features (v2)

- **Varsity/JV and Freshman rosters.** Varsity/JV shows by default; a toggle switches to Freshman (URL `#freshman`). Search and sort apply to whichever roster is shown. If no freshman CSV exists, the app says the roster isn't available yet.

## Data model

```json
{ "jersey": 12, "name": "Sample Player", "heightIn": 74, "weightLb": 195, "position": "QB" }
```

- `jersey`: **integer** so sorting is numeric (text sorting puts "10" before "2")
- `heightIn`: **total inches** so height sorts correctly; display as `6'2"`
- `weightLb`: integer pounds
- `position`: one of QB, RB, WR, TE, OL, DL, LB, DB, K, P
- Sort positions with a **custom order lookup** (the order above), not alphabetically

## Suggested project structure

```
data/roster.csv              # source of truth (real roster stays private, see below)
scripts/build-roster.ts      # converts CSV -> public/roster.json
public/roster.json           # generated output loaded by the app
src/
  components/                # RosterList, SearchBar, SortControl
  lib/                       # pure functions: search, sort, formatHeight (unit-tested)
  types.ts
```

Keep search, sorting, and height formatting as small pure functions in `src/lib/` so they are easy to test.

## Privacy rules (important)

The roster contains names, heights, and weights of **high school students (minors)**.

- **Do not commit the real DeSoto roster to any public repo.** Commit a **fake sample roster** for the repo, tests, and demos.
- Load the real roster privately at deploy time (private file or build-time secret).
- The real rosters live in the **private** repo `walkercaleb77-droid/team-spectator-data`, cloned next to this one: `../team-spectator-data/roster.csv` (Varsity/JV) and optional `roster-freshman.csv`. `scripts/build-roster.ts` reads that folder when present and falls back to the fake rosters in `data/sample/`.
- Confirm with the school or athletic director before publishing, including use of the school name, logo, or mascot.
- A password screen written in client-side JavaScript does **not** protect the data, since the JSON is still downloadable by anyone with the URL.

## Open decision: access control

Not decided yet whether the deployed site is:
1. **Public or unlisted URL**, which is simplest and fine if the school is comfortable with a public roster, or
2. **Gated**, for example with Cloudflare Access (email one-time-code login where the owner approves who gets in). This protects the whole site including the JSON. Check current free-tier limits.

## Hosting

Static hosting with a free tier: Cloudflare Pages, Netlify, Vercel, or GitHub Pages. Cloudflare Pages pairs naturally with Cloudflare Access if gating is chosen.

## Build order

1. Scaffold Vite + React + TypeScript and build the roster list using the sample data
2. Add sorting
3. Add search
4. Add the CSV-to-JSON build script
5. Add PWA support and polish the mobile-first layout
6. Add unit tests for the `src/lib/` functions, plus lint and a CI workflow
7. Write a README (screenshots or demo video, architecture, why JSON and a PWA) and deploy

## Portfolio checklist

- TypeScript throughout
- Unit tests for height formatting, position sort order, and search matching
- CI that runs lint and tests
- README with screenshots, architecture notes, and the reasoning behind key decisions
- Only fake sample data in the public repo
