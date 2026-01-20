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
    },
    {
      title: t("docs.architectureTitle"),
      icon: Layers,
      content: t("docs.architectureContent")
    },
    {
      title: t("docs.securityTitle"),
      icon: Shield,
      content: t("docs.securityContent")
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{t("docs.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("docs.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{t("common.language")}:</span>
            <LanguageSelector />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, idx) => (
            <Card key={idx} className="hover-elevate transition-all border-border/50 bg-card/50">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <section.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>{t("docs.needHelp")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 opacity-90 leading-relaxed">
              {t("docs.supportText")}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-2.5 bg-primary-foreground text-primary rounded-full font-semibold text-sm cursor-pointer hover:bg-white transition-colors shadow-lg">
                {t("docs.contactSupport")}
              </div>
              <div className="px-6 py-2.5 border border-primary-foreground/30 rounded-full font-semibold text-sm cursor-pointer hover:bg-primary-foreground/10 transition-colors">
                {t("docs.joinCommunity")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
