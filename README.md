# Habit Calendar

A mobile-first web app for tracking daily habits on a calendar, in the spirit of
Apple Calendar. Pick a day, tick the habits you did, and the calendar fills with
small colored dots that show your consistency over time.

- Year, Month, Week, and Day views with view-aware navigation, swipe on touch,
  and a date picker on the period title
- A draggable habit panel (collapsed, half, full) that always follows the active day
- Habit filter, add/rename/recolor/re-icon/delete habits, Sunday or Monday weeks
- System, Light, and Dark themes; keyboard and screen reader friendly

Built with React, TypeScript, Vite, Tailwind CSS v4, Radix primitives, date-fns,
and Lucide icons. Data is stored locally in the browser for now, behind a
repository interface that can be swapped for a backend.

## Getting started

Requires Node.js 20.19+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                             |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the dev server                     |
| `npm run build`     | Typecheck and build to `dist/`           |
| `npm run preview`   | Serve the production build               |
| `npm run typecheck` | TypeScript only                          |
| `npm run lint`      | ESLint (incl. a11y and import order)     |
| `npm run format`    | Prettier (sorts Tailwind classes too)    |
| `npm test`          | Vitest unit and component tests          |
| `npm run check`     | Typecheck, lint, format check, and tests |

No environment variables are required yet. If some are added, document them in
a committed `.env.example` and keep real values in an ignored `.env`.

## Architecture

```
src/
  components/
    ui/           Primitives: Button, IconButton, Checkbox, Dialog, BottomSheet, ...
    calendar/     Month/Week/Day/Year views, CalendarDayCell, MiniMonth
    habits/       HabitRow, HabitIndicator, HabitFilterBar, HabitPanel, HabitManager
    navigation/   TopNavigation, DateNavigator, PeriodPicker
    settings/     SettingsDialog and its sections
  hooks/          React hooks (theme, today, calendar grids, media queries)
  lib/
    calendar/     Pure date logic: date keys, ranges, navigation, formatting
    habits/       Pure habit logic: defaults, completions, filtering
    storage/      Persistence: repository interface, localStorage impl, validation
    utils/        Small helpers (cn)
  state/          App state: reducer, context provider, action hooks
  styles/
    tokens.css    Design tokens (colors, type, spacing, radius, shadows, motion)
    globals.css   Tailwind entry, dark variant, base styles
  types/          Shared domain types
```

Dependencies point one way: `components` → `hooks`/`state` → `lib` → `types`.
`lib` has no React and is unit-tested directly.

### Design tokens and theming

All visual values live in [`src/styles/tokens.css`](src/styles/tokens.css) inside a
Tailwind `@theme` block, so each token is both a CSS variable
(`--color-surface`) and a utility (`bg-surface`). Tailwind's default palette is
removed, so only semantic colors exist. Habit colors are a palette
(`--color-habit-green`, `-orange`, ...) with aliases for the default habits
(`--color-habit-sport`, ...). Typography uses roles (`text-title`, `text-body`,
`text-date`, `text-weekday`, ...), and motion uses `--duration-*` / `--ease-*`.

Dark mode overrides the same variables under `:root[data-theme='dark']`.
The user's preference (`light` / `dark` / `system`) is stored in settings and
resolved by `useThemeSync`; an inline script in `index.html` applies it before
first paint to avoid a flash.

### UI primitives

[`src/components/ui`](src/components/ui) holds the reusable components, most built
on [Radix](https://www.radix-ui.com/) for keyboard support, focus management,
and ARIA. Variants use `class-variance-authority` (e.g.
`<Button variant="ghost" size="sm">`). Import from `@/components/ui`.

- `Dialog` is the modal (a bottom sheet on phones, a centered card from `sm`).
- `Drawer` is a modal panel anchored to the bottom at every size.
- `BottomSheet` is the non-modal, draggable panel used by the habit tracker.
- `ConfirmDialog` guards destructive actions.

### Dates

`lib/calendar` wraps `date-fns`. Completions are keyed by a local-time
`YYYY-MM-DD` `DateKey` (`toDateKey`), never `toISOString()`, which would shift
days across timezones. Display formatting uses `Intl`.

### State and persistence

`state/` is a single `useReducer` exposed through context, with state and
dispatch in separate contexts. Components use `useAppState()` and
`useAppActions()`; no external state library. The active date drives
everything: the calendar shows the period containing it, and the habit panel
shows its habits, so they can never disagree. Calendar day cells are memoized
and receive per-day completion objects that keep their identity, so toggling a
habit re-renders only that day.

Persistence goes through the async `AppRepository` interface
(`lib/storage/repository.ts`). The current implementation stores versioned,
validated JSON in localStorage. Corrupted data is backed up to
`<key>:corrupted` and replaced with defaults instead of crashing. The provider
saves each slice when it changes. To add a backend, implement `AppRepository`
and pass it in `main.tsx`.
