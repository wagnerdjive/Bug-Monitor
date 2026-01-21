import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Target, CheckCircle2, Zap, Lock } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/i18n";
import logoPng from "@assets/IMG_5782_1768827594715.PNG";

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-foreground">
            <div className="relative flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
              <Target className="w-3 h-3 text-primary absolute" />
            </div>
            <span>TechMonitor</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button variant="ghost" asChild>
              <Link href="/auth">{t("nav.logIn")}</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/auth">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {t("landing.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {t("landing.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button
                size="lg"
                className="h-12 px-8 text-lg rounded-full"
                asChild
              >
                <Link href="/auth">{t("landing.startMonitoring")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg rounded-full border-border/50 hover:bg-zinc-50"
                asChild
              >
                <Link href="/documentation">{t("landing.viewDocs")}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="py-24 bg-muted/30 border-t border-border/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-display mb-4">
                {t("landing.featuresTitle")}
              </h2>
              <p className="text-muted-foreground">{t("landing.featuresSubtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  titleKey: "landing.feature1Title",
                  descKey: "landing.feature1Desc",
                },
                {
                  icon: Lock,
                  titleKey: "landing.feature2Title",
                  descKey: "landing.feature2Desc",
                },
                {
                  icon: CheckCircle2,
                  titleKey: "landing.feature3Title",
                  descKey: "landing.feature3Desc",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {t("landing.ctaTitle")}
            </h2>
            <p className="text-muted-foreground mb-8">{t("landing.ctaSubtitle")}</p>
            <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
              <Link href="/auth">{t("landing.getStarted")}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src={logoPng}
              alt="TechTarget Logo"
              className="h-32 object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            POWERED BY TECHTARGET
          </p>
        </div>
      </footer>
    </div>
  );
}
