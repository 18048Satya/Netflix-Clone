import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/types';

interface MovieCategoryRowProps {
  title: string;
  movies: Movie[];
}

const MovieCategoryRow: React.FC<MovieCategoryRowProps> = ({ title, movies }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 300;
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 300;
    }
  };

  return (
    <section className="mb-8 px-4 relative group">
      <h2 className="text-lg md:text-xl text-[#E5E5E5] font-bold mb-2">{title}</h2>
      
      <div className="relative">
        {/* Left Arrow */}
        <button 
          className="absolute left-0 z-10 h-full w-10 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={slideLeft}
        >
          <ChevronLeft className="text-white" />
        </button>
        
        {/* Right Arrow */}
        <button 
          className="absolute right-0 z-10 h-full w-10 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={slideRight}
        >
          <ChevronRight className="text-white" />
        </button>
        
        {/* Movie Slider */}
        <div ref={sliderRef} className="category-slider">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCategoryRow;
