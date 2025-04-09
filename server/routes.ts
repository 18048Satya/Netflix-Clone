import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Movies API routes
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });

  app.get("/api/movies/featured", async (req, res) => {
    try {
      const featuredMovie = await storage.getFeaturedMovie();
      res.json(featuredMovie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured movie" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const movie = await storage.getMovie(id);
      
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movie" });
    }
  });

  app.get("/api/movies/:id/similar", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const similarMovies = await storage.getSimilarMovies(id);
      res.json(similarMovies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch similar movies" });
    }
  });

  // Categories API routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // My List API routes
  app.get("/api/my-list", async (req, res) => {
    try {
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      const myList = await storage.getMyList(userId);
      res.json(myList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch my list" });
    }
  });

  app.post("/api/my-list", async (req, res) => {
    try {
      const { movieId } = req.body;
      
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }
      
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      await storage.addToMyList(userId, movieId);
      res.json({ message: "Movie added to my list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add movie to my list" });
    }
  });

  app.delete("/api/my-list/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      await storage.removeFromMyList(userId, movieId);
      res.json({ message: "Movie removed from my list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove movie from my list" });
    }
  });

  // Progress API routes
  app.get("/api/progress", async (req, res) => {
    try {
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      const progressList = await storage.getProgressList(userId);
      res.json(progressList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress list" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const { movieId, progressPercentage, lastWatched } = req.body;
      
      if (!movieId || progressPercentage === undefined || lastWatched === undefined) {
        return res.status(400).json({ message: "Movie ID, progress percentage, and last watched time are required" });
      }
      
      // For demo purposes, we'll use a fixed user ID (1)
      const userId = 1;
      await storage.saveProgress(userId, movieId, progressPercentage, lastWatched);
      res.json({ message: "Progress saved" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  // Search API route
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.json([]);
      }
      
      const results = await storage.searchMovies(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search movies" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
