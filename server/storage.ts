import { movies as moviesTable, users as usersTable, categories as categoriesTable, progress as progressTable, type Movie, type User, type Category, type Progress } from "@shared/schema";
import { moviesData } from "./data/movies";
import { categoriesData } from "./data/categories";
import { usersData } from "./data/users";
import { connectToDatabase, getDb } from './mongodb';
import { Collection, Db, ObjectId } from 'mongodb';
import session from 'express-session';
import { log } from './vite';
import connectMongoDBSession from 'connect-mongodb-session';

export interface IStorage {
  // MongoDB collections
  initializeDatabase(): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
  
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

export class MongoDBStorage implements IStorage {
  private db: Db | null = null;
  private usersCollection: Collection | null = null;
  private moviesCollection: Collection | null = null;
  private categoriesCollection: Collection | null = null;
  private progressCollection: Collection | null = null;
  sessionStore: session.Store;

  constructor() {
    // Set up MongoDB session store
    const MongoDBStore = connectMongoDBSession(session);
    this.sessionStore = new MongoDBStore({
      uri: `mongodb+srv://NETFLIX:${process.env.MONGODB_PASSWORD}@cluster0.ygvxw78.mongodb.net/netflix?retryWrites=true&w=majority&appName=Cluster0`,
      collection: 'sessions'
    });

    // Handle session store errors
    this.sessionStore.on('error', (error: any) => {
      log(`Session store error: ${error}`, 'mongodb');
    });
  }

  async initializeDatabase(): Promise<void> {
    try {
      // Connect to MongoDB
      const db = await connectToDatabase();
      this.db = db;

      // Get collections
      this.usersCollection = db.collection('users');
      this.moviesCollection = db.collection('movies');
      this.categoriesCollection = db.collection('categories');
      this.progressCollection = db.collection('progress');

      // Check if we need to initialize data
      const movieCount = await this.moviesCollection.countDocuments();
      if (movieCount === 0) {
        log('Initializing database with sample data...', 'mongodb');
        await this.seedData();
      } else {
        log('Database already contains data', 'mongodb');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async seedData(): Promise<void> {
    try {
      // Insert movies
      if (this.moviesCollection) {
        const moviesWithObjectId = moviesData.map(movie => ({
          ...movie,
          _id: movie.id // Use existing id as _id for MongoDB
        }));
        await this.moviesCollection.insertMany(moviesWithObjectId);
        log(`Inserted ${moviesData.length} movies`, 'mongodb');
      }

      // Insert categories
      if (this.categoriesCollection) {
        const categoriesWithObjectId = categoriesData.map(category => ({
          ...category,
          _id: category.id // Use existing id as _id for MongoDB
        }));
        await this.categoriesCollection.insertMany(categoriesWithObjectId);
        log(`Inserted ${categoriesData.length} categories`, 'mongodb');
      }

      // Insert users
      if (this.usersCollection) {
        const usersWithObjectId = usersData.map(user => ({
          ...user,
          _id: user.id // Use existing id as _id for MongoDB
        }));
        await this.usersCollection.insertMany(usersWithObjectId);
        log(`Inserted ${usersData.length} users`, 'mongodb');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  async getAllMovies(): Promise<Movie[]> {
    if (!this.moviesCollection) throw new Error('Movies collection not initialized');
    
    const movies = await this.moviesCollection.find({}).toArray();
    return movies.map(movie => ({
      ...movie,
      id: movie._id, // Convert _id to id for client
    })) as Movie[];
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    if (!this.moviesCollection) throw new Error('Movies collection not initialized');
    
    const movie = await this.moviesCollection.findOne({ _id: id });
    if (!movie) return undefined;
    
    return {
      ...movie,
      id: movie._id, // Convert _id to id for client
    } as Movie;
  }

  async getFeaturedMovie(): Promise<Movie | undefined> {
    if (!this.moviesCollection) throw new Error('Movies collection not initialized');
    
    const movie = await this.moviesCollection.findOne({ isFeatured: true });
    if (!movie) return undefined;
    
    return {
      ...movie,
      id: movie._id, // Convert _id to id for client
    } as Movie;
  }

  async getSimilarMovies(id: number): Promise<Movie[]> {
    if (!this.moviesCollection) throw new Error('Movies collection not initialized');
    
    // First get the movie to find its categories
    const movie = await this.getMovie(id);
    if (!movie) return [];
    
    // Find movies with similar categories
    const similarMovies = await this.moviesCollection.find({
      _id: { $ne: id },
      categories: { $elemMatch: { $in: movie.categories } }
    }).limit(6).toArray();
    
    return similarMovies.map(movie => ({
      ...movie,
      id: movie._id, // Convert _id to id for client
    })) as Movie[];
  }

  async searchMovies(query: string): Promise<Movie[]> {
    if (!this.moviesCollection) throw new Error('Movies collection not initialized');
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    
    // Search for movies using text search or regex
    const movies = await this.moviesCollection.find({
      $or: [
        { title: { $regex: lowerQuery, $options: 'i' } },
        { description: { $regex: lowerQuery, $options: 'i' } },
        { categories: { $elemMatch: { $regex: lowerQuery, $options: 'i' } } }
      ]
    }).toArray();
    
    return movies.map(movie => ({
      ...movie,
      id: movie._id, // Convert _id to id for client
    })) as Movie[];
  }

  async getAllCategories(): Promise<any[]> {
    if (!this.categoriesCollection || !this.moviesCollection) {
      throw new Error('Categories or Movies collections not initialized');
    }
    
    const categories = await this.categoriesCollection.find({}).toArray();
    const movies = await this.getAllMovies();
    
    // Add movies to each category
    return Promise.all(categories.map(async (category) => {
      const categoryMovies = movies.filter(movie => 
        movie.categories.includes(category.name)
      );
      
      return {
        ...category,
        id: category._id, // Convert _id to id for client
        movies: categoryMovies,
      };
    }));
  }

  async getMyList(userId: number): Promise<Movie[]> {
    if (!this.usersCollection || !this.moviesCollection) {
      throw new Error('Users or Movies collections not initialized');
    }
    
    // Get the user
    const user = await this.usersCollection.findOne({ _id: userId });
    if (!user || !user.myList || user.myList.length === 0) return [];
    
    // Get movies in the user's list
    const movies = await this.moviesCollection.find({
      _id: { $in: user.myList }
    }).toArray();
    
    return movies.map(movie => ({
      ...movie,
      id: movie._id, // Convert _id to id for client
    })) as Movie[];
  }

  async addToMyList(userId: number, movieId: number): Promise<void> {
    if (!this.usersCollection || !this.moviesCollection) {
      throw new Error('Users or Movies collections not initialized');
    }
    
    // Check if movie exists
    const movie = await this.moviesCollection.findOne({ _id: movieId });
    if (!movie) throw new Error('Movie not found');
    
    // Add movie to user's list if not already there
    await this.usersCollection.updateOne(
      { _id: userId },
      { $addToSet: { myList: movieId } }, // $addToSet ensures no duplicates
      { upsert: false }
    );
  }

  async removeFromMyList(userId: number, movieId: number): Promise<void> {
    if (!this.usersCollection) throw new Error('Users collection not initialized');
    
    // Remove movie from user's list
    await this.usersCollection.updateOne(
      { _id: userId },
      { $pull: { myList: movieId } }
    );
  }

  async getProgressList(userId: number): Promise<Movie[]> {
    if (!this.progressCollection || !this.moviesCollection) {
      throw new Error('Progress or Movies collections not initialized');
    }
    
    // Get progress entries for this user
    const progressEntries = await this.progressCollection.find({ userId }).toArray();
    if (progressEntries.length === 0) return [];
    
    // Get the movie details and merge with progress
    const moviesWithProgress = await Promise.all(progressEntries.map(async (progress) => {
      const movie = await this.getMovie(progress.movieId);
      if (!movie) return null;
      
      return {
        ...movie,
        progress: {
          progressPercentage: progress.progressPercentage,
          lastWatched: progress.lastWatched,
        },
      };
    }));
    
    // Filter out any null results (movies that weren't found)
    return moviesWithProgress.filter((movie): movie is Movie => !!movie);
  }

  async saveProgress(userId: number, movieId: number, progressPercentage: number, lastWatched: number): Promise<void> {
    if (!this.progressCollection) throw new Error('Progress collection not initialized');
    
    // Update progress document or create if it doesn't exist
    await this.progressCollection.updateOne(
      { userId, movieId },
      { 
        $set: { 
          progressPercentage, 
          lastWatched 
        } 
      },
      { upsert: true }
    );
  }

  async getUser(id: number): Promise<User | undefined> {
    if (!this.usersCollection) throw new Error('Users collection not initialized');
    
    const user = await this.usersCollection.findOne({ _id: id });
    if (!user) return undefined;
    
    return {
      ...user,
      id: user._id, // Convert _id to id for client
    } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.usersCollection) throw new Error('Users collection not initialized');
    
    const user = await this.usersCollection.findOne({ 
      username: { $regex: new RegExp(`^${username}$`, 'i') } // Case-insensitive match
    });
    
    if (!user) return undefined;
    
    return {
      ...user,
      id: user._id, // Convert _id to id for client
    } as User;
  }

  async createUser(userData: { username: string; password: string; avatarUrl?: string }): Promise<User> {
    if (!this.usersCollection) throw new Error('Users collection not initialized');
    
    // Check if username already exists
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) throw new Error('Username already exists');
    
    // Generate a unique ID
    const maxUserDoc = await this.usersCollection.find().sort({ _id: -1 }).limit(1).toArray();
    const maxId = maxUserDoc.length > 0 ? maxUserDoc[0]._id : 0;
    const newId = Number(maxId) + 1;
    
    // Create the new user document
    const newUser = {
      _id: newId,
      id: newId,
      username: userData.username,
      password: userData.password,
      avatarUrl: userData.avatarUrl || null,
      myList: [],
    };
    
    // Insert the new user
    await this.usersCollection.insertOne(newUser);
    
    return newUser as User;
  }
}

export const storage = new MongoDBStorage();
