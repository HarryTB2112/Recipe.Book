import { getCollection } from 'astro:content';
import { getRecipeSlug } from './categories';

export interface SearchIndexEntry {
  title: string;
  slug: string;
  description: string;
  categories: string[];
  tags: string[];
  datePublished: string;
}

export async function buildSearchIndex(): Promise<SearchIndexEntry[]> {
  const recipes = await getCollection('recipes');
  return recipes
    .sort((a, b) => b.data.datePublished.localeCompare(a.data.datePublished))
    .map((r) => ({
      title: r.data.title,
      slug: getRecipeSlug(r.id),
      description: r.data.description,
      categories: r.data.categories,
      tags: r.data.tags ?? [],
      datePublished: r.data.datePublished,
    }));
}
