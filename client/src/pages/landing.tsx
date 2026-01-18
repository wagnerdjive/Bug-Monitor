import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, Zap, Lock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span>SentryClone</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="/api/login">Log In</a>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="/api/login">Get Started</a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span>🚀 Now in Public Beta</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Stop guessing why your <br/> app crashed.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Real-time error tracking and performance monitoring for developers who care about code quality. Installs in 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
                <a href="/api/login">Start Monitoring for Free</a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-border/50 hover:bg-white/5" asChild>
                <a href="#features">View Documentation</a>
              </Button>
            </div>
            
            {/* Dashboard Preview */}
            <div className="mt-20 rounded-xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-2 animate-in fade-in zoom-in duration-1000 delay-500 max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform">
              <div className="rounded-lg bg-zinc-900 aspect-[16/9] flex items-center justify-center border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Abstract UI representation */}
                <div className="w-full h-full p-8 flex flex-col gap-4 opacity-50">
                  <div className="flex gap-4">
                    <div className="w-64 h-full bg-zinc-800/50 rounded-lg" />
                    <div className="flex-1 space-y-4">
                      <div className="h-32 w-full bg-zinc-800/50 rounded-lg" />
                      <div className="h-64 w-full bg-zinc-800/50 rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-zinc-500 font-mono text-sm">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-950/50 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-display mb-4">Everything you need to debug faster</h2>
              <p className="text-muted-foreground">Built for modern engineering teams.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Real-time Alerts",
                  desc: "Get notified immediately when exceptions occur in production via Slack or Email."
                },
                {
                  icon: Lock,
                  title: "Secure by Default",
                  desc: "Enterprise-grade security with role-based access control and data encryption."
                },
                {
                  icon: CheckCircle2,
                  title: "Easy Integration",
                  desc: "Drop-in SDKs for React, Node.js, Python, and more. Get started in minutes."
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-primary/20 hover:bg-zinc-900/80 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-muted-foreground text-sm">
        <p>© 2024 SentryClone. All rights reserved.</p>
      </footer>
    </div>
  );
}
