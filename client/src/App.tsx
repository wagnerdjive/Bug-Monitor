import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ProjectDetails from "@/pages/project-details";
import EventDetails from "@/pages/event-details";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  // Show loading spinner for initial auth check
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged out, show Landing page for root
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        {/* Redirect any other protected routes to Landing/Login if accessed directly */}
        <Route path="/projects/:id" component={Landing} />
        <Route path="/events/:id" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // If user is logged in
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects/:id" component={ProjectDetails} />
      <Route path="/events/:id" component={EventDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
