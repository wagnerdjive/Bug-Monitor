import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShieldAlert,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    // Add more global nav items here if needed
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <ShieldAlert className="w-6 h-6" />
          <span>SentryClone</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-r border-border">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2 font-display text-primary">
                <ShieldAlert className="w-6 h-6" />
                SentryClone
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-auto pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <div className="p-6 border-b border-border/50">
          <Link href="/">
            <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground hover:opacity-80 transition-opacity cursor-pointer">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <span>SentryClone</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-medium",
                  location === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-background/50">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
