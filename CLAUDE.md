# Development rules

1. Reuse existing components before creating new ones; check `src/components/ui` first.
2. Create reusable primitives for repeated UI patterns, with variants rather than separate components.
3. Use design tokens (`src/styles/tokens.css`) instead of hardcoded visual values.
4. Keep business logic in `src/lib`, separate from presentation.
5. Keep date logic in `src/lib/calendar`, separate from calendar rendering. Use `DateKey` (`YYYY-MM-DD`, local time) for completions.
6. Keep persistence behind `AppRepository`; never call localStorage from components.
7. Keep components focused and reasonably small.
8. Avoid unnecessary dependencies and architectural complexity without a reason.
9. Preserve existing conventions.
10. Maintain accessibility (semantic HTML, keyboard, focus, labels, reduced motion) and responsive, mobile-first layout.
11. Test changes rather than assuming they work: `npm run check` and `npm run build`.
12. Fix errors instead of working around them; no temporary hacks.
