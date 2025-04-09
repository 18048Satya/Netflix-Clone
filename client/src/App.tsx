import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import AuthPage from "@/pages/auth-page";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import CategoryPage from "@/pages/CategoryPage";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/tv-shows" component={() => <CategoryPage categoryType="tv-shows" />} />
      <ProtectedRoute path="/movies" component={() => <CategoryPage categoryType="movies" />} />
      <ProtectedRoute path="/new" component={() => <CategoryPage categoryType="new" />} />
      <ProtectedRoute path="/my-list" component={() => <CategoryPage categoryType="my-list" />} />
      <ProtectedRoute path="/movie/:id" component={MovieDetail} />
      <ProtectedRoute path="/watch/:id" component={Watch} />
      <ProtectedRoute path="/search" component={Search} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Router />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
