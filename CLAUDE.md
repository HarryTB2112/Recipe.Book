# Aimée's Recipe Book — Developer Guide for Claude

## Project Overview

A static Astro 5 recipe site built for Aimée. Hosted on Vercel. No database, no auth, no CMS.

## Tech Stack

- **Framework**: Astro 5 (static output)
- **Language**: TypeScript everywhere in build-time code
- **Styling**: Plain CSS only — no Tailwind, no CSS-in-JS
- **Client JS**: Vanilla JS inline `<script>` blocks inside `.astro` components only
- **Adapter**: `@astrojs/vercel` (static mode)
- **Content**: Astro Content Collections with Zod schema validation

## Commands

```bash
npm run dev      # start dev server (http://localhost:4321)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

Always run `npm run build` after making changes to verify no build errors.

## Project Structure

```text
src/
  components/      # Reusable Astro components
  content/
    recipes/       # Recipe markdown files (can be nested in subdirs)
    config.ts      # Zod schema for content collections
  layouts/
    BaseLayout.astro
  pages/           # File-based routing
  styles/
    global.css     # Single global stylesheet — all CSS lives here
  utils/
    categories.ts  # getRecipeSlug(), slugifyCategory(), getAllCategories()
    format.ts      # formatTime(), formatDate(), formatQuantity()
    search.ts      # buildSearchIndex()
public/
  images/recipes/  # Recipe images — reference as /images/recipes/...
  scripts/         # Standalone JS files (kept as reference; prefer inline scripts)
  favicon.svg
```

## Critical Astro 5 Behaviours

### Slug handling

`slug` is a **reserved field** in Astro 5 content collections — never put it in the Zod schema.
Derive URL slugs from `entry.id` using the helper in `src/utils/categories.ts`:

```ts
getRecipeSlug('pasta/creamy-mushroom-pasta.md'); // → 'creamy-mushroom-pasta'
```

`entry.id` includes the file extension and any subdirectory prefix — both are stripped by `getRecipeSlug`.

### Scripts in components

Use inline `<script>` blocks inside `.astro` files — **not** `<script src="/public/...">`.
Astro 5 will error if you reference public assets in a `<script src>` without `is:inline`.

### Content collection config

Lives at `src/content/config.ts`. Any folder under `src/content/` that isn't declared as a collection will trigger a deprecation warning — don't leave empty folders there.

## Styling Rules

- **Mobile-first**: write base styles for mobile, then add `@media (min-width: X)` for larger screens
- **Breakpoint**: `640px` is the main mobile/desktop split (hamburger → desktop nav)
- **All CSS** goes in `src/styles/global.css`. Page/component-specific styles can go in scoped `<style>` blocks in `.astro` files if needed, but prefer global.css for anything reusable
- **Theme variables** are CSS custom properties at the top of global.css under `:root`. Change colours there — don't hardcode hex values elsewhere
- **No Tailwind** — use CSS classes and custom properties

## Theme Variables (quick reference)

```css
--color-primary        /* terracotta #c05e3c — main brand colour */
--color-secondary      /* sage green  #5a7a5a */
--color-bg             /* warm cream  #fdf6ee */
--color-text           /* dark brown  #2c1f14 */
--font-heading         /* Georgia, serif */
--font-body            /* system-ui, sans-serif */
```

## Adding Recipes

Drop a `.md` file in `src/content/recipes/` (subdirectories are fine).
Required frontmatter fields: `title`, `description`, `datePublished` (YYYY-MM-DD), `categories` (array), `servings`, `times`, `heroImage`, `ingredients`.
The build will fail with a helpful error if any required field is missing or invalid — this is intentional.

### Ingredient schema

```yaml
ingredients:
  - item: 'Plain flour'
    quantity: 200
    unit: 'g' # must be one of: g kg ml l tsp tbsp cup piece clove pinch
    note: 'sifted' # optional
    scalable: true # optional, default true; set false for "to taste" items
  - item: 'Salt'
    quantity: null # null = display as-is, never scale
    unit: null
    note: 'to taste'
    scalable: false
```

## Images

- Store in `public/images/recipes/<recipe-slug>/`
- Reference in markdown as absolute paths: `![Alt text](/images/recipes/flourless-brownie-cookies/step1.png)`
- SVG placeholders are fine for development
- Hero images are displayed at 960×480px aspect ratio; step images are full prose width

## Search

- Search index generated at build time → `public/search-index.json`
- Client-side search script is inline in `src/components/SearchBox.astro`
- Searches: title, description, categories, tags (case-insensitive substring match)

## Recipe Scaling

- Scaler script is inline in `src/components/ServingsScaler.astro`
- Ingredient data is embedded as JSON in a `<script type="application/json">` block
- Ingredients with `quantity: null` or `scalable: false` are never modified by the scaler

## Mobile Nav

- Hamburger toggle: visible below 640px, hidden above
- Desktop nav: hidden below 640px, shown above
- Drawer slides in from the right; full-screen overlay closes it on click
- Body scroll is locked while drawer is open

## Deployment

- Vercel auto-deploys on push to main
- Build command: `npm run build`
- Set `SITE_URL` environment variable in Vercel project settings to your production URL
- No `vercel.json` needed for static output

## Additional Instructions

Ensure you update this CLAUDE.md when you feel neccessary.
