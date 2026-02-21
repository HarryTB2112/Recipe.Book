import { getCollection } from 'astro:content';

/**
 * Slugify a category name.
 * "Baked Goods" → "baked-goods"
 */
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Restore a display name from a slug.
 * Best-effort: capitalise each word.
 */
export function categoryDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Get all unique categories with their counts.
 */
export async function getAllCategories(): Promise<
  { name: string; slug: string; count: number }[]
> {
  const recipes = await getCollection('recipes');
  const map = new Map<string, { name: string; count: number }>();

  for (const recipe of recipes) {
    for (const cat of recipe.data.categories) {
      const slug = slugifyCategory(cat);
      if (map.has(slug)) {
        map.get(slug)!.count++;
      } else {
        map.set(slug, { name: cat, count: 1 });
      }
    }
  }

  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Derive a URL-safe slug from a content entry id.
 * "pasta/creamy-mushroom-pasta.md" → "creamy-mushroom-pasta"
 * "lemon-drizzle-cake.md" → "lemon-drizzle-cake"
 */
export function getRecipeSlug(id: string): string {
  return id
    .split('/')
    .pop()!
    .replace(/\.[^.]+$/, '');
}

/**
 * Verify all recipe slugs are unique (call at build time).
 */
export async function assertUniqueSlugs(): Promise<void> {
  const recipes = await getCollection('recipes');
  const seen = new Set<string>();
  for (const r of recipes) {
    const slug = getRecipeSlug(r.id);
    if (seen.has(slug)) {
      throw new Error(`Duplicate slug detected: "${slug}" in ${r.id}`);
    }
    seen.add(slug);
  }
}
