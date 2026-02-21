/**
 * Canonical taxonomy lists for the recipe collection.
 * These are the single source of truth — import here rather than
 * duplicating values in recipe frontmatter or UI code.
 *
 * Categories = dish-type (what the recipe IS).
 * Cuisine, Diet, and Protein are separate dimensions.
 */

/** Primary browse taxonomy — dish type only. */
export const CATEGORIES = [
  'Baking',
  'Biscuits & Cookies',
  'Curries & Stews',
  'Desserts',
  'Pasta & Noodles',
  'Rice & Grains',
  'Salads',
  'Seafood',
  'Sides',
  'Soups',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Dietary labels — only apply when the recipe genuinely qualifies. */
export const DIETS = [
  'Dairy-Free',
  'Gluten-Free',
  'Vegan',
  'Vegetarian',
  'Sugar-Free',
] as const;

export type Diet = (typeof DIETS)[number];

/** Primary protein source in the dish. */
export const PROTEINS = [
  'Beef',
  'Chicken',
  'Eggs',
  'Fish',
  'Lamb',
  'Pork',
  'Seafood',
  'Tofu & Legumes',
] as const;

export type Protein = (typeof PROTEINS)[number];

/**
 * Cuisine is a free string (no enum) to avoid needing a schema change
 * every time a new cuisine appears. Common values for reference:
 * American · French · Greek · Indian · Italian · Japanese · Mexican ·
 * South Asian · Spanish · Thai
 */
