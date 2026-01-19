import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Menu,
  Globe,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import logoPng from "@assets/IMG_5782_1768827594715.PNG";

// Translations
const translations = {
  en: {
    dashboard: "Dashboard",
    signOut: "Sign Out",
    poweredBy: "Powered by TechTarget",
    language: "Language",
    menu: "Menu",
  },
  pt: {
    dashboard: "Painel",
    signOut: "Sair",
    poweredBy: "Desenvolvido por TechTarget",
    language: "Idioma",
    menu: "Menu",
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [lang, setLang] = useState<"en" | "pt">(() => {
    return (localStorage.getItem("lang") as "en" | "pt") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = translations[lang];

  const navItems = [
    { href: "/", label: t.dashboard, icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <ShieldCheck className="w-6 h-6" />
          <span>TechMonitor</span>
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
                <ShieldCheck className="w-6 h-6" />
                TechMonitor
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
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4" />
                  {t.signOut}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground hover:opacity-80 transition-opacity cursor-pointer">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span>TechMonitor</span>
              </div>
            </Link>
          </div>
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

        <div className="p-4 border-t border-border/50 bg-muted/50">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
              {t.poweredBy}
            </div>
            <img 
              src={logoPng} 
              alt="TechTarget Logo" 
              className="h-8 object-contain"
            />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-xs">
                  <Globe className="h-3 w-3" />
                  {t.language}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("pt")}>Português</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar className="w-8 h-8 border border-border">
              <AvatarImage src={user?.profileImageUrl || undefined} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4" />
            {t.signOut}
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
