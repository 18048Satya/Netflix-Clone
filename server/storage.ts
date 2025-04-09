import { movies as moviesTable, users as usersTable, categories as categoriesTable, progress as progressTable, type Movie, type User, type Category, type Progress } from "@shared/schema";
import { moviesData } from "./data/movies";
import { categoriesData } from "./data/categories";
import { usersData } from "./data/users";

export interface IStorage {
  // Movies
  getAllMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  getFeaturedMovie(): Promise<Movie | undefined>;
  getSimilarMovies(id: number): Promise<Movie[]>;
  searchMovies(query: string): Promise<Movie[]>;
  
  // Categories
  getAllCategories(): Promise<any[]>;
  
  // My List
  getMyList(userId: number): Promise<Movie[]>;
  addToMyList(userId: number, movieId: number): Promise<void>;
  removeFromMyList(userId: number, movieId: number): Promise<void>;
  
  // Progress
  getProgressList(userId: number): Promise<Movie[]>;
  saveProgress(userId: number, movieId: number, progressPercentage: number, lastWatched: number): Promise<void>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(userData: { username: string; password: string; avatarUrl?: string }): Promise<User>;
}

export class MemStorage implements IStorage {
  private movies: Map<number, Movie>;
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private progressMap: Map<string, Progress>;
  
  constructor() {
    this.movies = new Map();
    this.users = new Map();
    this.categories = new Map();
    this.progressMap = new Map();
    
    // Initialize with mock data
    this.initializeData();
  }
  
  private initializeData() {
    // Initialize movies
    moviesData.forEach((movie) => {
      this.movies.set(movie.id, movie);
    });
    
    // Initialize categories
    categoriesData.forEach((category) => {
      this.categories.set(category.id, category);
    });
    
    // Initialize users
    usersData.forEach((user) => {
      this.users.set(user.id, user);
    });
  }
  
  async getAllMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }
  
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }
  
  async getFeaturedMovie(): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find((movie) => movie.isFeatured);
  }
  
  async getSimilarMovies(id: number): Promise<Movie[]> {
    const movie = this.movies.get(id);
    
    if (!movie) {
      return [];
    }
    
    // Get movies that share categories with the given movie
    return Array.from(this.movies.values())
      .filter((m) => m.id !== id && m.categories.some((cat) => movie.categories.includes(cat)))
      .slice(0, 6);
  }
  
  async searchMovies(query: string): Promise<Movie[]> {
    if (!query) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.movies.values()).filter((movie) => 
      movie.title.toLowerCase().includes(lowerQuery) || 
      movie.description.toLowerCase().includes(lowerQuery) ||
      movie.categories.some((cat) => cat.toLowerCase().includes(lowerQuery))
    );
  }
  
  async getAllCategories(): Promise<any[]> {
    const categoriesWithMovies = [];
    
    for (const category of this.categories.values()) {
      const categoryMovies = Array.from(this.movies.values())
        .filter((movie) => movie.categories.includes(category.name));
      
      categoriesWithMovies.push({
        ...category,
        movies: categoryMovies,
      });
    }
    
    return categoriesWithMovies;
  }
  
  async getMyList(userId: number): Promise<Movie[]> {
    const user = this.users.get(userId);
    
    if (!user || !user.myList) {
      return [];
    }
    
    return user.myList
      .map((movieId) => this.movies.get(movieId))
      .filter((movie): movie is Movie => !!movie);
  }
  
  async addToMyList(userId: number, movieId: number): Promise<void> {
    const user = this.users.get(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (!this.movies.has(movieId)) {
      throw new Error("Movie not found");
    }
    
    if (!user.myList) {
      user.myList = [];
    }
    
    if (!user.myList.includes(movieId)) {
      user.myList.push(movieId);
    }
  }
  
  async removeFromMyList(userId: number, movieId: number): Promise<void> {
    const user = this.users.get(userId);
    
    if (!user || !user.myList) {
      return;
    }
    
    user.myList = user.myList.filter((id) => id !== movieId);
  }
  
  async getProgressList(userId: number): Promise<Movie[]> {
    const moviesWithProgress = [];
    
    for (const [key, progress] of this.progressMap.entries()) {
      if (progress.userId === userId) {
        const movie = this.movies.get(progress.movieId);
        
        if (movie) {
          moviesWithProgress.push({
            ...movie,
            progress: {
              progressPercentage: progress.progressPercentage,
              lastWatched: progress.lastWatched,
            },
          });
        }
      }
    }
    
    return moviesWithProgress;
  }
  
  async saveProgress(userId: number, movieId: number, progressPercentage: number, lastWatched: number): Promise<void> {
    const key = `${userId}-${movieId}`;
    
    this.progressMap.set(key, {
      userId,
      movieId,
      progressPercentage,
      lastWatched,
    });
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(userData: { username: string; password: string; avatarUrl?: string }): Promise<User> {
    // Generate a new user ID (max ID + 1)
    const maxId = Math.max(0, ...Array.from(this.users.keys()));
    const newId = maxId + 1;
    
    const newUser: User = {
      id: newId,
      username: userData.username,
      password: userData.password,
      avatarUrl: userData.avatarUrl,
      myList: [],
    };
    
    this.users.set(newId, newUser);
    return newUser;
  }
}

export const storage = new MemStorage();
