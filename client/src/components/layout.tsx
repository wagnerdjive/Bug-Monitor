import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Menu,
  Users,
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
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/i18n";
import logoPng from "@assets/IMG_5782_1768827594715.PNG";

interface LayoutProps {
  children: React.ReactNode;
  simple?: boolean;
}

export function Layout({ children, simple = false }: LayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  if (simple) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground hover:opacity-80 transition-opacity cursor-pointer">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span>TechMonitor</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              {!user && (
                <Link href="/auth">
                  <Button size="sm">{t("auth.login")}</Button>
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {children}
          </div>
        </main>
        <footer className="py-8 border-t border-border/50 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
            <img src={logoPng} alt="TechTarget Logo" className="h-8 object-contain opacity-50" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              POWERED BY TECHTARGET
            </p>
          </div>
        </footer>
      </div>
    );
  }

  const navItems = [
    { href: "/", label: t("dashboard.title"), icon: LayoutDashboard },
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: t("admin.title"), icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <ShieldCheck className="w-6 h-6" />
          <span>TechMonitor</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
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
                    {t("dashboard.logout")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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
              POWERED BY TECHTARGET
            </div>
            <img 
              src={logoPng} 
              alt="TechTarget Logo" 
              className="h-8 object-contain"
            />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <LanguageSelector />
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
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            {t("dashboard.logout")}
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto bg-background/50">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
