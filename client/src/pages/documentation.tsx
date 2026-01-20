import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { BookOpen, Code, Terminal, Shield, Cpu, Layers } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";

export default function Documentation() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("docs.introTitle"),
      icon: BookOpen,
      content: t("docs.introContent")
    },
    {
      title: t("docs.getStartedTitle"),
      icon: Terminal,
      content: t("docs.getStartedContent")
    },
    {
      title: t("docs.sdkIntegrationTitle"),
      icon: Code,
      content: t("docs.sdkIntegrationContent")
    },
    {
      title: t("docs.errorTrackingTitle"),
      icon: Cpu,
      content: t("docs.errorTrackingContent")
    }
  ];

  return (
    <Layout>
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
          <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-full border border-border/40">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2">{t("common.language")}</span>
            <LanguageSelector />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {sections.map((section, idx) => (
            <Card key={idx} className="hover-elevate transition-all duration-300 border-border/40 bg-card/40 flex flex-col group h-full overflow-hidden shadow-sm hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-5 space-y-0 p-6 pb-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-3 shadow-inner">
                  <section.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 px-6 pb-6 pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
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
