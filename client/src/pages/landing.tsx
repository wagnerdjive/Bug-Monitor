import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Zap, Lock, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoPng from "@assets/IMG_5782_1768827594715.PNG";

const landingTranslations = {
  en: {
    login: "Log In",
    getStarted: "Get Started",
    beta: "🚀 Powered by TechTarget",
    heroTitle: "Stop guessing why your app broke.",
    heroSubtitle: "Real-time error tracking for developers who care about quality.",
    cta: "Start Monitoring for Free",
    docs: "View Documentation",
    featuresTitle: "Everything you need to debug faster",
    featuresSubtitle: "Built for modern engineering teams.",
    footer: "© 2024 TechMonitor. All rights reserved. Powered by TechTarget.",
    lang: "Language"
  },
  pt: {
    login: "Entrar",
    getStarted: "Começar Agora",
    beta: "🚀 Desenvolvido por TechTarget",
    heroTitle: "Pare de adivinhar por que seu app quebrou.",
    heroSubtitle: "Monitoramento de erros em tempo real para desenvolvedores que se preocupam com qualidade.",
    cta: "Começar Monitoramento Grátis",
    docs: "Ver Documentação",
    featuresTitle: "Tudo o que você precisa para depurar mais rápido",
    featuresSubtitle: "Feito para equipes de engenharia modernas.",
    footer: "© 2024 TechMonitor. Todos os direitos reservados. Desenvolvido por TechTarget.",
    lang: "Idioma"
  }
};

export default function Landing() {
  const [lang, setLang] = useState<"en" | "pt">(() => {
    return (localStorage.getItem("lang") as "en" | "pt") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = landingTranslations[lang];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span>TechMonitor</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth">{t.login}</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/auth">{t.getStarted}</Link>
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
              <span>{t.beta}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
                <Link href="/auth">{t.cta}</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-border/50 hover:bg-zinc-50" asChild>
                <a href="#features">{t.docs}</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-display mb-4">{t.featuresTitle}</h2>
              <p className="text-muted-foreground">{t.featuresSubtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: lang === "en" ? "Real-time Alerts" : "Alertas em Tempo Real",
                  desc: lang === "en" ? "Get notified immediately when exceptions occur." : "Seja notificado imediatamente quando ocorrerem exceções."
                },
                {
                  icon: Lock,
                  title: lang === "en" ? "Secure by Default" : "Seguro por Padrão",
                  desc: lang === "en" ? "Enterprise-grade security and data encryption." : "Segurança de nível empresarial e criptografia de dados."
                },
                {
                  icon: CheckCircle2,
                  title: lang === "en" ? "Easy Integration" : "Fácil Integração",
                  desc: lang === "en" ? "Drop-in SDKs. Get started in minutes." : "SDKs prontos para uso. Comece em minutos."
                }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/20 transition-all duration-300 group">
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

      <footer className="py-12 border-t border-border/50 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {t.beta}
            </p>
            <img 
              src={logoPng} 
              alt="TechTarget Logo" 
              className="h-10 object-contain"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  {t.lang}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("pt")}>Português</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-sm text-muted-foreground">{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
