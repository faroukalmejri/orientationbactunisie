import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SignUp from "@/pages/SignUp";
import SignIn from "@/pages/SignIn";
import Profile from "@/pages/Profile";
import OrientationPage from "@/pages/app/Orientation";
import CalculatorPage from "@/pages/app/Calculator";
import QuizPage from "@/pages/app/Quiz";
import GuidePage from "@/pages/app/Guide";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { AuthProvider } from "@/context/AuthContext";
import { AppLayout } from "@/layouts/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function ProtectedApp() {
  return (
    <ProtectedRoute>
      <DisclaimerModal />
      <AppLayout>
        <Switch>
          <Route path="/app/orientation" component={OrientationPage} />
          <Route path="/app/calculator" component={CalculatorPage} />
          <Route path="/app/quiz" component={QuizPage} />
          <Route path="/app/guide" component={GuidePage} />
          <Route path="/app/profile" component={Profile} />
          <Route path="/app">
            <Redirect to="/app/orientation" />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/app/:rest*" component={ProtectedApp} />
      <Route component={NotFound} />
    </Switch>
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
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
