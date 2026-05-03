import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import Profile from "@/pages/Profile";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { AuthProvider } from "@/context/AuthContext";
import { NavBar } from "@/components/NavBar";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <DisclaimerModal />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
