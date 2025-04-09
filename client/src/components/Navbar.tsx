import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, LogOut, LogIn, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NETFLIX_LOGO = () => (
  <svg className="w-28 md:w-32" viewBox="0 0 111 30" fill="#E50914">
    <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
  </svg>
);

const DEFAULT_AVATAR = "https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABQnOnMxhb19v9lQZScL86ZpnI21__HC3npqH3Y3NP74wlq1gmRcQu2h8RL6-QbkghIqgMQwFMI1h_ohXWAG3f2gWcP3DyA.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch();
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation('/auth');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black to-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer">
            <NETFLIX_LOGO />
          </Link>
          <nav className="hidden md:flex ml-10">
            <ul className="flex">
              <li className="mr-5"><Link href="/" className="text-white hover:text-[#E5E5E5]">Home</Link></li>
              <li className="mr-5"><Link href="/?category=tv-shows" className="text-[#E5E5E5] hover:text-white">TV Shows</Link></li>
              <li className="mr-5"><Link href="/?category=movies" className="text-[#E5E5E5] hover:text-white">Movies</Link></li>
              <li className="mr-5"><Link href="/?category=new" className="text-[#E5E5E5] hover:text-white">New & Popular</Link></li>
              <li><Link href="/?category=my-list" className="text-[#E5E5E5] hover:text-white">My List</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={onSearchSubmit} className="relative mr-4">
              <Input
                type="text"
                placeholder="Search"
                className="bg-black bg-opacity-50 border border-gray-600 text-white pl-8 pr-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setShowSearch(false);
                }}
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </form>
          ) : (
            <button 
              onClick={() => setShowSearch(true)} 
              className="mr-4 text-white hover:text-gray-300"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {/* Auth Actions */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <img 
                    src={user.avatarUrl || DEFAULT_AVATAR} 
                    alt={user.username} 
                    className="w-8 h-8 rounded" 
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#141414] border-gray-700">
                <DropdownMenuLabel className="text-white">{user.username}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-[#E5E5E5] hover:text-white cursor-pointer focus:bg-gray-800"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center">
              <Link href="/auth" className="mr-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#E5E5E5] hover:bg-transparent"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
