// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/data/movies.ts
var moviesData = [
  {
    id: 1,
    title: "The Midnight Sky",
    description: "In the aftermath of a global catastrophe, a lone scientist in the Arctic races to contact the crew of a spacecraft returning to a devastated Earth.",
    thumbnailUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    year: 2023,
    duration: 118,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-girl-blowing-a-bubble-gum-at-an-amusement-park-1226-large.mp4",
    categories: ["Sci-Fi", "Drama", "Trending Now"],
    isFeatured: true,
    rating: "PG-13",
    cast: ["George Clooney", "Felicity Jones", "David Oyelowo"],
    director: "George Clooney",
    matchPercentage: 97
  },
  {
    id: 2,
    title: "The Academy",
    description: "A riveting drama about a prestigious acting school where students compete for coveted roles while navigating the cutthroat world of performing arts.",
    thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
    year: 2022,
    duration: 124,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    categories: ["Drama", "Trending Now"],
    rating: "R",
    cast: ["Emma Stone", "Timoth\xE9e Chalamet", "Viola Davis"],
    director: "Damien Chazelle",
    matchPercentage: 92
  },
  {
    id: 3,
    title: "Dark Waters",
    description: "A mysterious oceanic research facility has been abandoned, leaving behind a dark secret that threatens to consume everything in its path.",
    thumbnailUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2021,
    duration: 107,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    categories: ["Horror", "Thriller", "Trending Now"],
    rating: "R",
    cast: ["Naomi Watts", "Oscar Isaac", "John Boyega"],
    director: "Guillermo del Toro",
    matchPercentage: 85
  },
  {
    id: 4,
    title: "Night's Edge",
    description: "A determined detective unravels a complex web of deceit as she hunts a serial killer who only strikes during the full moon.",
    thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    year: 2023,
    duration: 118,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-down-a-mountain-41576-large.mp4",
    categories: ["Crime", "Mystery", "Trending Now"],
    rating: "PG-13",
    cast: ["Jodie Foster", "Mahershala Ali", "Javier Bardem"],
    director: "David Fincher",
    matchPercentage: 91
  },
  {
    id: 5,
    title: "Deep Space",
    description: "When a distant space colony goes silent, a team of specialists must journey to the edge of the galaxy to uncover what happened.",
    thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2021,
    duration: 135,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    categories: ["Sci-Fi", "Adventure", "Trending Now"],
    rating: "PG-13",
    cast: ["Jessica Chastain", "Michael B. Jordan", "John Cho"],
    director: "Denis Villeneuve",
    matchPercentage: 94
  },
  {
    id: 6,
    title: "From Yesterday",
    description: "A time-traveling historian becomes trapped in the 1920s and must find a way back without altering the course of history.",
    thumbnailUrl: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2022,
    duration: 112,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-1237-large.mp4",
    categories: ["Drama", "Sci-Fi", "Trending Now"],
    rating: "PG-13",
    cast: ["Cillian Murphy", "Saoirse Ronan", "Dev Patel"],
    director: "Christopher Nolan",
    matchPercentage: 88
  },
  {
    id: 7,
    title: "Last Chance",
    description: "With only 24 hours to clear his name, a former special forces operative must navigate a city in lockdown to find the real criminal.",
    thumbnailUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2023,
    duration: 101,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-runs-past-ground-level-shot-32809-large.mp4",
    categories: ["Action", "Thriller", "Trending Now"],
    rating: "R",
    cast: ["Idris Elba", "Daniel Craig", "Michelle Yeoh"],
    director: "Antoine Fuqua",
    matchPercentage: 90
  },
  {
    id: 8,
    title: "Rise Up",
    description: "In a dystopian future where freedom is just a memory, a young rebel sparks a revolution that could change everything.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    year: 2021,
    duration: 142,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-peace-flag-in-a-protest-4188-large.mp4",
    categories: ["Action", "Drama", "Popular on Netflix"],
    rating: "PG-13",
    cast: ["Zendaya", "Tom Holland", "Zoe Saldana"],
    director: "Lana Wachowski",
    matchPercentage: 89
  },
  {
    id: 9,
    title: "Beyond Tomorrow",
    description: "As artificial intelligence reaches unprecedented levels, one programmer discovers the terrifying truth behind the world's most advanced AI.",
    thumbnailUrl: "https://images.unsplash.com/photo-1626563120600-a4a711278b48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2022,
    duration: 116,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technological-interface-scan-28944-large.mp4",
    categories: ["Sci-Fi", "Thriller", "Popular on Netflix"],
    rating: "PG-13",
    cast: ["Ryan Gosling", "Ana de Armas", "Joseph Gordon-Levitt"],
    director: "Alex Garland",
    matchPercentage: 95
  },
  {
    id: 10,
    title: "Bright Lights",
    description: "A small-town musician gets her big break, but quickly discovers that fame comes with a heavy price.",
    thumbnailUrl: "https://images.unsplash.com/photo-1611419010196-a360856fc42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    year: 2023,
    duration: 128,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-with-a-dog-in-a-park-in-the-rain-40793-large.mp4",
    categories: ["Drama", "Music", "Popular on Netflix"],
    rating: "PG-13",
    cast: ["Lady Gaga", "Bradley Cooper", "Florence Pugh"],
    director: "Greta Gerwig",
    matchPercentage: 87
  },
  {
    id: 11,
    title: "The Shadows",
    description: "In a world where shadows have become sentient and dangerous, a small group of survivors must navigate through a post-apocalyptic landscape.",
    thumbnailUrl: "https://images.unsplash.com/photo-1568111561564-08726a1563e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1627773523255-84111895bf3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2023,
    duration: 131,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mysterious-forest-at-night-1609-large.mp4",
    categories: ["Horror", "Sci-Fi", "Popular on Netflix"],
    rating: "R",
    cast: ["Emma Stone", "Ryan Gosling", "Idris Elba", "Ana de Armas"],
    director: "Denis Villeneuve",
    matchPercentage: 97
  },
  {
    id: 12,
    title: "Voyager",
    description: "After discovering a hidden message in ancient ruins, an archaeologist embarks on a global adventure to uncover humanity's true origins.",
    thumbnailUrl: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1113&q=80",
    year: 2021,
    duration: 144,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4",
    categories: ["Adventure", "Mystery", "Popular on Netflix"],
    rating: "PG-13",
    cast: ["Charlize Theron", "Lupita Nyong'o", "Hugh Jackman"],
    director: "Patty Jenkins",
    matchPercentage: 86
  },
  {
    id: 13,
    title: "Eclipse",
    description: "During a rare solar phenomenon, strange events begin occurring worldwide, leading a scientist to believe something catastrophic is approaching.",
    thumbnailUrl: "https://images.unsplash.com/photo-1682200010854-a08fcdd59ae7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    year: 2022,
    duration: 116,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-eclipse-of-the-sun-in-space-42554-large.mp4",
    categories: ["Sci-Fi", "Thriller", "Popular on Netflix"],
    rating: "PG-13",
    cast: ["John Boyega", "Daisy Ridley", "Oscar Isaac"],
    director: "J.J. Abrams",
    matchPercentage: 92
  },
  {
    id: 14,
    title: "Quantum Protocol",
    description: "When quantum computers begin communicating with each other autonomously, a programmer must shut down the system before it's too late.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    year: 2023,
    duration: 112,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-server-room-with-many-computers-4818-large.mp4",
    categories: ["Sci-Fi", "Thriller", "Continue Watching"],
    rating: "PG-13",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Anthony Mackie"],
    director: "Lilly Wachowski",
    matchPercentage: 94
  },
  {
    id: 15,
    title: "Winter's End",
    description: "As an endless winter grips the planet, the last remaining humans struggle to find a new home before the final frost arrives.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555448248-2571daf6344b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2021,
    duration: 138,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-white-ice-block-22743-large.mp4",
    categories: ["Drama", "Sci-Fi", "Continue Watching"],
    rating: "PG-13",
    cast: ["Kate Winslet", "Mark Ruffalo", "Jennifer Lawrence"],
    director: "Alejandro Gonz\xE1lez I\xF1\xE1rritu",
    matchPercentage: 89
  },
  {
    id: 16,
    title: "Neon Future",
    description: "In a neon-drenched cyberpunk city, a hacker with augmented abilities takes on powerful corporations to free the masses from digital control.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    year: 2023,
    duration: 126,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-traffic-in-the-neon-lights-of-shibuya-in-tokyo-4441-large.mp4",
    categories: ["Sci-Fi", "Action", "My List"],
    rating: "R",
    cast: ["Scarlett Johansson", "Michael Fassbender", "Ken Watanabe"],
    director: "Taika Waititi",
    matchPercentage: 93
  },
  {
    id: 17,
    title: "Wilderness",
    description: "A family camping trip turns into a fight for survival when they discover they're being stalked by something that isn't entirely human.",
    thumbnailUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1274&q=80",
    year: 2022,
    duration: 105,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-forest-on-a-sunny-day-41492-large.mp4",
    categories: ["Horror", "Thriller", "My List"],
    rating: "R",
    cast: ["Emily Blunt", "John Krasinski", "Millicent Simmonds"],
    director: "Jordan Peele",
    matchPercentage: 86
  }
];

// server/data/categories.ts
var categoriesData = [
  {
    id: 1,
    name: "Trending Now"
  },
  {
    id: 2,
    name: "Popular on Netflix"
  },
  {
    id: 3,
    name: "Continue Watching"
  },
  {
    id: 4,
    name: "My List"
  },
  {
    id: 5,
    name: "Action"
  },
  {
    id: 6,
    name: "Adventure"
  },
  {
    id: 7,
    name: "Comedy"
  },
  {
    id: 8,
    name: "Crime"
  },
  {
    id: 9,
    name: "Drama"
  },
  {
    id: 10,
    name: "Horror"
  },
  {
    id: 11,
    name: "Mystery"
  },
  {
    id: 12,
    name: "Sci-Fi"
  },
  {
    id: 13,
    name: "Thriller"
  }
];

// server/data/users.ts
var usersData = [
  {
    id: 1,
    username: "netflixuser",
    password: "password123",
    avatarUrl: "https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABQnOnMxhb19v9lQZScL86ZpnI21__HC3npqH3Y3NP74wlq1gmRcQu2h8RL6-QbkghIqgMQwFMI1h_ohXWAG3f2gWcP3DyA.png",
    myList: [16, 17]
    // Initially, the user has "Neon Future" and "Wilderness" in their list
  }
];

// server/mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/mongodb.ts
import dotenv from "dotenv";
dotenv.config();
var password = process.env.MONGODB_PASSWORD;
var connectionString = `mongodb+srv://NETFLIX:${password}@cluster0.ygvxw78.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
var client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});
var db;
async function connectToDatabase() {
  try {
    await client.connect();
    log("Successfully connected to MongoDB Atlas!", "mongodb");
    db = client.db("netflix");
    await db.command({ ping: 1 });
    log("Database connection confirmed", "mongodb");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// server/storage.ts
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
var MongoDBStorage = class {
  db = null;
  usersCollection = null;
  moviesCollection = null;
  categoriesCollection = null;
  progressCollection = null;
  sessionStore;
  constructor() {
    const MongoDBStore = connectMongoDBSession(session);
    this.sessionStore = new MongoDBStore({
      uri: `mongodb+srv://NETFLIX:${process.env.MONGODB_PASSWORD}@cluster0.ygvxw78.mongodb.net/netflix?retryWrites=true&w=majority&appName=Cluster0`,
      collection: "sessions"
    });
    this.sessionStore.on("error", (error) => {
      log(`Session store error: ${error}`, "mongodb");
    });
  }
  async initializeDatabase() {
    try {
      const db2 = await connectToDatabase();
      this.db = db2;
      this.usersCollection = db2.collection("users");
      this.moviesCollection = db2.collection("movies");
      this.categoriesCollection = db2.collection("categories");
      this.progressCollection = db2.collection("progress");
      const movieCount = await this.moviesCollection.countDocuments();
      if (movieCount === 0) {
        log("Initializing database with sample data...", "mongodb");
        await this.seedData();
      } else {
        log("Database already contains data", "mongodb");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
  async seedData() {
    try {
      if (this.moviesCollection) {
        const moviesWithObjectId = moviesData.map((movie) => ({
          ...movie,
          _id: movie.id
          // Use existing id as _id for MongoDB
        }));
        await this.moviesCollection.insertMany(moviesWithObjectId);
        log(`Inserted ${moviesData.length} movies`, "mongodb");
      }
      if (this.categoriesCollection) {
        const categoriesWithObjectId = categoriesData.map((category) => ({
          ...category,
          _id: category.id
          // Use existing id as _id for MongoDB
        }));
        await this.categoriesCollection.insertMany(categoriesWithObjectId);
        log(`Inserted ${categoriesData.length} categories`, "mongodb");
      }
      if (this.usersCollection) {
        const usersWithObjectId = usersData.map((user) => ({
          ...user,
          _id: user.id
          // Use existing id as _id for MongoDB
        }));
        await this.usersCollection.insertMany(usersWithObjectId);
        log(`Inserted ${usersData.length} users`, "mongodb");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }
  async getAllMovies() {
    if (!this.moviesCollection) throw new Error("Movies collection not initialized");
    const movies = await this.moviesCollection.find({}).toArray();
    return movies.map((movie) => ({
      ...movie,
      id: movie._id
      // Convert _id to id for client
    }));
  }
  async getMovie(id) {
    if (!this.moviesCollection) throw new Error("Movies collection not initialized");
    const movie = await this.moviesCollection.findOne({ _id: id });
    if (!movie) return void 0;
    return {
      ...movie,
      id: movie._id
      // Convert _id to id for client
    };
  }
  async getFeaturedMovie() {
    if (!this.moviesCollection) throw new Error("Movies collection not initialized");
    const movie = await this.moviesCollection.findOne({ isFeatured: true });
    if (!movie) return void 0;
    return {
      ...movie,
      id: movie._id
      // Convert _id to id for client
    };
  }
  async getSimilarMovies(id) {
    if (!this.moviesCollection) throw new Error("Movies collection not initialized");
    const movie = await this.getMovie(id);
    if (!movie) return [];
    const similarMovies = await this.moviesCollection.find({
      _id: { $ne: id },
      categories: { $elemMatch: { $in: movie.categories } }
    }).limit(6).toArray();
    return similarMovies.map((movie2) => ({
      ...movie2,
      id: movie2._id
      // Convert _id to id for client
    }));
  }
  async searchMovies(query) {
    if (!this.moviesCollection) throw new Error("Movies collection not initialized");
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    const movies = await this.moviesCollection.find({
      $or: [
        { title: { $regex: lowerQuery, $options: "i" } },
        { description: { $regex: lowerQuery, $options: "i" } },
        { categories: { $elemMatch: { $regex: lowerQuery, $options: "i" } } }
      ]
    }).toArray();
    return movies.map((movie) => ({
      ...movie,
      id: movie._id
      // Convert _id to id for client
    }));
  }
  async getAllCategories() {
    if (!this.categoriesCollection || !this.moviesCollection) {
      throw new Error("Categories or Movies collections not initialized");
    }
    const categories = await this.categoriesCollection.find({}).toArray();
    const movies = await this.getAllMovies();
    return Promise.all(categories.map(async (category) => {
      const categoryMovies = movies.filter(
        (movie) => movie.categories.includes(category.name)
      );
      return {
        ...category,
        id: category._id,
        // Convert _id to id for client
        movies: categoryMovies
      };
    }));
  }
  async getMyList(userId) {
    if (!this.usersCollection || !this.moviesCollection) {
      throw new Error("Users or Movies collections not initialized");
    }
    const user = await this.usersCollection.findOne({ _id: userId });
    if (!user || !user.myList || user.myList.length === 0) return [];
    const movies = await this.moviesCollection.find({
      _id: { $in: user.myList }
    }).toArray();
    return movies.map((movie) => ({
      ...movie,
      id: movie._id
      // Convert _id to id for client
    }));
  }
  async addToMyList(userId, movieId) {
    if (!this.usersCollection || !this.moviesCollection) {
      throw new Error("Users or Movies collections not initialized");
    }
    const movie = await this.moviesCollection.findOne({ _id: movieId });
    if (!movie) throw new Error("Movie not found");
    await this.usersCollection.updateOne(
      { _id: userId },
      { $addToSet: { myList: movieId } },
      // $addToSet ensures no duplicates
      { upsert: false }
    );
  }
  async removeFromMyList(userId, movieId) {
    if (!this.usersCollection) throw new Error("Users collection not initialized");
    await this.usersCollection.updateOne(
      { _id: userId },
      { $pull: { myList: movieId } }
    );
  }
  async getProgressList(userId) {
    if (!this.progressCollection || !this.moviesCollection) {
      throw new Error("Progress or Movies collections not initialized");
    }
    const progressEntries = await this.progressCollection.find({ userId }).toArray();
    if (progressEntries.length === 0) return [];
    const moviesWithProgress = await Promise.all(progressEntries.map(async (progress) => {
      const movie = await this.getMovie(progress.movieId);
      if (!movie) return null;
      return {
        ...movie,
        progress: {
          progressPercentage: progress.progressPercentage,
          lastWatched: progress.lastWatched
        }
      };
    }));
    return moviesWithProgress.filter((movie) => !!movie);
  }
  async saveProgress(userId, movieId, progressPercentage, lastWatched) {
    if (!this.progressCollection) throw new Error("Progress collection not initialized");
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
  async getUser(id) {
    if (!this.usersCollection) throw new Error("Users collection not initialized");
    const user = await this.usersCollection.findOne({ _id: id });
    if (!user) return void 0;
    return {
      ...user,
      id: user._id
      // Convert _id to id for client
    };
  }
  async getUserByUsername(username) {
    if (!this.usersCollection) throw new Error("Users collection not initialized");
    const user = await this.usersCollection.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") }
      // Case-insensitive match
    });
    if (!user) return void 0;
    return {
      ...user,
      id: user._id
      // Convert _id to id for client
    };
  }
  async createUser(userData) {
    if (!this.usersCollection) throw new Error("Users collection not initialized");
    const existingUser = await this.getUserByUsername(userData.username);
    if (existingUser) throw new Error("Username already exists");
    const maxUserDoc = await this.usersCollection.find().sort({ _id: -1 }).limit(1).toArray();
    const maxId = maxUserDoc.length > 0 ? maxUserDoc[0]._id : 0;
    const newId = Number(maxId) + 1;
    const newUser = {
      _id: newId,
      id: newId,
      username: userData.username,
      password: userData.password,
      avatarUrl: userData.avatarUrl || null,
      myList: []
    };
    await this.usersCollection.insertOne(newUser);
    return newUser;
  }
};
var storage = new MongoDBStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password2) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password2, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "netflix-clone-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      secure: isProduction,
      // Use secure cookies in production
      httpOnly: true,
      // Prevents JavaScript from reading the cookie
      sameSite: isProduction ? "none" : "lax"
      // Required for cross-site cookies in production
    },
    // Use MongoDB session store
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password2, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password2, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch movies" });
    }
  });
  app2.get("/api/movies/featured", async (req, res) => {
    try {
      const featuredMovie = await storage.getFeaturedMovie();
      res.json(featuredMovie);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured movie" });
    }
  });
  app2.get("/api/movies/:id", async (req, res) => {
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
  app2.get("/api/movies/:id/similar", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const similarMovies = await storage.getSimilarMovies(id);
      res.json(similarMovies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch similar movies" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/my-list", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user?.id || 1 : 1;
      const myList = await storage.getMyList(userId);
      res.json(myList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch my list" });
    }
  });
  app2.post("/api/my-list", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Please log in to add movies to your list" });
    }
    try {
      const { movieId } = req.body;
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }
      const userId = req.user?.id || 1;
      await storage.addToMyList(userId, movieId);
      res.json({ message: "Movie added to my list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add movie to my list" });
    }
  });
  app2.delete("/api/my-list/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Please log in to remove movies from your list" });
    }
    try {
      const movieId = parseInt(req.params.id);
      const userId = req.user?.id || 1;
      await storage.removeFromMyList(userId, movieId);
      res.json({ message: "Movie removed from my list" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove movie from my list" });
    }
  });
  app2.get("/api/progress", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user?.id || 1 : 1;
      const progressList = await storage.getProgressList(userId);
      res.json(progressList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress list" });
    }
  });
  app2.post("/api/progress", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Please log in to save your progress" });
    }
    try {
      const { movieId, progressPercentage, lastWatched } = req.body;
      if (!movieId || progressPercentage === void 0 || lastWatched === void 0) {
        return res.status(400).json({ message: "Movie ID, progress percentage, and last watched time are required" });
      }
      const userId = req.user?.id || 1;
      await storage.saveProgress(userId, movieId, progressPercentage, lastWatched);
      res.json({ message: "Progress saved" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save progress" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.json([]);
      }
      const results = await storage.searchMovies(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search movies" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import cors from "cors";
var app = express2();
var corsOptions = {
  // Allow requests from any origin when in development
  // In production, you should specify the exact origins
  origin: process.env.NODE_ENV === "production" ? process.env.ALLOWED_ORIGINS?.split(",") || "https://your-production-frontend-domain.com" : true,
  credentials: true,
  // Allow cookies and authentication headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    log("Initializing MongoDB database...", "mongodb");
    await storage.initializeDatabase();
    log("MongoDB database initialized successfully", "mongodb");
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
