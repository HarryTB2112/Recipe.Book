import { defineCollection, z } from 'astro:content';
import { CATEGORIES, DIETS, PROTEINS } from '../data/taxonomy';

const unitEnum = z.enum([
  'g',
  'kg',
  'ml',
  'l',
  'tsp',
  'tbsp',
  'cup',
  'piece',
  'clove',
  'pinch',
]);

const ingredientSchema = z.object({
  item: z.string(),
  quantity: z.number().nullable(),
  unit: unitEnum.nullable(),
  note: z.string().optional(),
  scalable: z.boolean().optional().default(true),
});

const recipesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    datePublished: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    categories: z
      .array(z.enum(CATEGORIES as unknown as [string, ...string[]]))
      .min(1),
    diet: z
      .array(z.enum(DIETS as unknown as [string, ...string[]]))
      .optional()
      .default([]),
    protein: z
      .array(z.enum(PROTEINS as unknown as [string, ...string[]]))
      .optional()
      .default([]),
    servings: z.number().int().positive(),
    times: z.object({
      prepMinutes: z.number().int().nonnegative(),
      cookMinutes: z.number().int().nonnegative(),
      totalMinutes: z.number().int().positive(),
    }),
    heroImage: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    ingredients: z.array(ingredientSchema).min(1),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    cuisine: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('Aimée'),
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = {
  recipes: recipesCollection,
};
