import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { BookOpen, Code, Terminal, Cpu, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Documentation() {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    {
      title: t("docs.introTitle"),
      icon: BookOpen,
      content: t("docs.introContent"),
      details: "TechMonitor provides a robust set of tools for developers to track, analyze, and resolve application errors in real-time. By integrating our SDK, you gain access to comprehensive error reports, including environment details, user context, and historical data to identify patterns and prevent future regressions."
    },
    {
      title: t("docs.getStartedTitle"),
      icon: Terminal,
      content: t("docs.getStartedContent"),
      details: "Getting started is as simple as creating an account and initializing your first project. Once your project is created, you'll be provided with a unique API key that authenticates all data sent from your application. We support various platforms and frameworks, ensuring you can monitor all your services from a single dashboard."
    },
    {
      title: t("docs.sdkIntegrationTitle"),
      icon: Code,
      content: t("docs.sdkIntegrationContent"),
      details: "Our SDK integration is designed to be minimal and high-performance. It hooks into your application's error handling lifecycle to capture unhandled exceptions automatically. You can also manually log events, attach custom metadata, and record breadcrumbs (navigation events, API calls, etc.) to recreate the exact state leading up to an error."
    },
    {
      title: t("docs.errorTrackingTitle"),
      icon: Cpu,
      content: t("docs.errorTrackingContent"),
      details: "Advanced error tracking features include automatic grouping of similar issues, stack trace symbolication for minified code, and real-time alerts. You can configure notification rules to stay informed via email or webhooks when critical errors exceed defined thresholds, ensuring your team can respond immediately to production incidents."
    }
  ];

  return (
    <Layout simple>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("docs.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              {t("docs.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-8 mb-16">
          {sections.map((section, idx) => (
            <Card 
              key={idx} 
              className={cn(
                "hover-elevate transition-all duration-300 border-border/40 bg-card/40 flex flex-col group overflow-hidden shadow-sm hover:shadow-md cursor-pointer",
                expandedSection === idx && "ring-2 ring-primary/20"
              )}
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
            >
              <CardHeader className="flex flex-row items-center gap-5 space-y-0 p-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform shadow-inner">
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{section.title}</CardTitle>
                </div>
                {expandedSection === idx ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
                {expandedSection === idx && (
                  <div className="mt-4 pt-4 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-foreground/80 leading-relaxed italic">
                      {section.details}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-all duration-500" />
          <CardHeader className="p-8 pb-4 relative z-10">
            <CardTitle className="text-3xl font-bold">{t("docs.needHelp")}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 relative z-10">
            <p className="mb-8 text-lg opacity-90 leading-relaxed max-w-2xl">
              {t("docs.supportText")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-white text-primary rounded-full font-bold text-sm cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl">
                {t("docs.contactSupport")}
              </button>
              <button className="px-8 py-3 border-2 border-white/30 rounded-full font-bold text-sm cursor-pointer hover:bg-white/10 active:scale-95 transition-all">
                {t("docs.joinCommunity")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
