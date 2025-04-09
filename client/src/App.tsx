import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import Watch from "@/pages/Watch";
import Search from "@/pages/Search";
import Navbar from "@/components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/movie/:id" component={MovieDetail} />
        <Route path="/watch/:id" component={Watch} />
        <Route path="/search" component={Search} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
