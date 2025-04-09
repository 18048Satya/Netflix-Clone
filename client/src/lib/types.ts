export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl?: string;
  year: number;
  duration: number; // in minutes
  videoUrl: string;
  categories: string[];
  isFeatured?: boolean;
  rating?: string;
  cast?: string[];
  director?: string;
  matchPercentage?: number;
  progress?: {
    progressPercentage: number;
    lastWatched: number;
  };
}

export interface Category {
  id: number;
  name: string;
  movies: Movie[];
}

export interface User {
  id: number;
  username: string;
  avatarUrl?: string;
  myList: number[];
}

export interface Progress {
  userId: number;
  movieId: number;
  progressPercentage: number;
  lastWatched: number;
}
