import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Documentation from "@/pages/documentation";
import ProjectDetails from "@/pages/project-details";
import EventDetails from "@/pages/event-details";
import AuthPage from "@/pages/auth-page";
import Admin from "@/pages/admin";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth">
        {user ? <Redirect to="/" /> : <AuthPage />}
      </Route>
      <Route path="/admin">
        {user && user.role === "ADMIN" ? <Admin /> : <Redirect to="/" />}
      </Route>
      <Route path="/profile">
        {user ? <Profile /> : <Redirect to="/auth" />}
      </Route>
      <Route path="/documentation" component={Documentation} />
      <Route path="/projects/:id">
        {user ? <ProjectDetails /> : <Redirect to="/auth" />}
      </Route>
      <Route path="/events/:id">
        {user ? <EventDetails /> : <Redirect to="/auth" />}
      </Route>
      <Route path="/">
        {!user ? <Landing /> : <Dashboard />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
