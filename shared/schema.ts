import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url"),
  myList: jsonb("my_list").$type<number[]>().default([]),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  bannerUrl: text("banner_url"),
  year: integer("year").notNull(),
  duration: integer("duration").notNull(), // in minutes
  videoUrl: text("video_url").notNull(),
  categories: jsonb("categories").$type<string[]>().notNull(),
  isFeatured: boolean("is_featured").default(false),
  rating: text("rating"),
  cast: jsonb("cast").$type<string[]>().default([]),
  director: text("director"),
  matchPercentage: integer("match_percentage"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  movieId: integer("movie_id").notNull().references(() => movies.id),
  progressPercentage: integer("progress_percentage").default(0),
  lastWatched: integer("last_watched").default(0), // timestamp in seconds
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  avatarUrl: true,
});

export const insertMovieSchema = createInsertSchema(movies).pick({
  title: true,
  description: true,
  thumbnailUrl: true,
  bannerUrl: true,
  year: true,
  duration: true,
  videoUrl: true,
  categories: true,
  isFeatured: true,
  rating: true,
  cast: true,
  director: true,
  matchPercentage: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  movieId: true,
  progressPercentage: true,
  lastWatched: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
