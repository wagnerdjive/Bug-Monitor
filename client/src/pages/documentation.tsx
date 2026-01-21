import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { 
  BookOpen, Code, Terminal, Cpu, ChevronDown, ChevronUp, 
  Copy, Check, Target, Zap, Bell, Workflow, Search 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Documentation() {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sdkExamples = [
    {
      lang: "JavaScript / TypeScript",
      icon: "SiTypescript",
      code: `// Install SDK
npm install @techmonitor/sdk

// Initialize
import { init } from "@techmonitor/sdk";

init({
  apiKey: "YOUR_PROJECT_API_KEY",
  environment: "production",
  release: "v1.0.0"
});

// Manual reporting
try {
  // your code
} catch (error) {
  TechMonitor.captureException(error, {
    level: 'fatal',
    tags: { section: 'checkout' }
  });
}`
    },
    {
      lang: "Java / Spring Boot",
      icon: "SiSpringboot",
      code: `// Add dependency (Maven)
<dependency>
    <groupId>com.techmonitor</groupId>
    <artifactId>techmonitor-spring-boot-starter</artifactId>
    <version>1.1.0</version>
</dependency>

// application.yml
techmonitor:
  api-key: "YOUR_PROJECT_API_KEY"
  environment: \${SPRING_PROFILES_ACTIVE}
  enabled: true

// Service usage
@Service
public class PaymentService {
    @Autowired
    private TechMonitorClient client;

    public void process() {
        try {
            // business logic
        } catch (Exception e) {
            client.capture(e, Map.of("userId", "123"));
        }
    }
}`
    },
    {
      lang: "Python / Django / Flask",
      icon: "SiPython",
      code: `# Install
pip install techmonitor-sdk

# Initialize
import techmonitor

techmonitor.init(
    api_key="YOUR_PROJECT_API_KEY",
    environment="production",
    debug=False
)

# Integrations are automatic for 
# Django, Flask, and FastAPI
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    techmonitor.capture_exception(exc)
    return JSONResponse(status_code=500)`
    }
  ];

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
      details: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                {t("docs.securityAuth")}
              </h4>
              <p className="text-sm text-muted-foreground">{t("docs.securityAuthDesc")}</p>
            </div>
            <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Workflow className="w-4 h-4 text-primary" />
                {t("docs.workflowTitle")}
              </h4>
              <p className="text-sm text-muted-foreground">{t("docs.workflowDesc")}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed">{t("docs.envSupport")}</p>
        </div>
      )
    },
    {
      title: t("docs.sdkIntegrationTitle"),
      icon: Code,
      content: t("docs.sdkIntegrationContent"),
      details: (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{t("docs.sdkVersion")}</Badge>
            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20">{t("docs.sdkStable")}</Badge>
          </div>
          <Tabs defaultValue={sdkExamples[0].lang} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/30">
              {sdkExamples.map((example) => (
                <TabsTrigger key={example.lang} value={example.lang} className="text-xs py-2 data-[state=active]:bg-card">
                  {example.lang}
                </TabsTrigger>
              ))}
            </TabsList>
            {sdkExamples.map((example) => (
              <TabsContent key={example.lang} value={example.lang} className="relative mt-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-2 top-2 h-8 w-8 z-20 text-slate-400 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(example.code);
                  }}
                >
                  {copiedCode === example.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <div className="bg-slate-950 rounded-lg p-5 font-mono text-[11px] md:text-xs text-slate-300 overflow-x-auto border border-border/50 shadow-inner">
                  <pre>{example.code}</pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )
    },
    {
      title: t("docs.errorTrackingTitle"),
      icon: Cpu,
      content: t("docs.errorTrackingContent"),
      details: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: t('docs.featureBreadcrumbs'), icon: Search, desc: t('docs.featureBreadcrumbsDesc') },
              { label: t('docs.featureAlerts'), icon: Bell, desc: t('docs.featureAlertsDesc') },
              { label: t('docs.featureGrouping'), icon: Zap, desc: t('docs.featureGroupingDesc') }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/20 border border-border/40">
                <feature.icon className="w-5 h-5 mb-2 text-primary" />
                <span className="text-xs font-bold block mb-1">{feature.label}</span>
                <span className="text-[10px] text-muted-foreground">{feature.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <Layout simple>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3 h-3" />
            {t("docs.docsCenter")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
            {t("docs.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("docs.docsPreamble")}
          </p>
        </div>

        <div className="grid gap-6 mb-16">
          {sections.map((section, idx) => (
            <Card 
              key={idx} 
              className={cn(
                "transition-all duration-500 border-border/40 bg-card/30 backdrop-blur-sm flex flex-col group overflow-hidden shadow-none hover:shadow-2xl hover:bg-card/50 cursor-pointer",
                expandedSection === idx && "ring-1 ring-primary/30 bg-card/60"
              )}
              onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
            >
              <CardHeader className="flex flex-row items-center gap-6 space-y-0 p-8">
                <div className={cn(
                  "p-4 rounded-2xl shrink-0 transition-all duration-500 shadow-xl border border-white/5",
                  expandedSection === idx ? "bg-primary text-primary-foreground scale-110 shadow-primary/20" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold tracking-tight mb-1">{section.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground/80 line-clamp-1">{section.content}</CardDescription>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  expandedSection === idx ? "bg-primary/10 text-primary rotate-0" : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  {expandedSection === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </CardHeader>
              <CardContent className={cn(
                "px-8 transition-all duration-500 ease-in-out",
                expandedSection === idx ? "pb-8 opacity-100 max-h-[2000px] translate-y-0" : "pb-0 opacity-0 max-h-0 -translate-y-4 pointer-events-none"
              )}>
                <div className="pt-6 border-t border-border/40">
                  <div className="text-foreground/90 leading-relaxed text-base">
                    {typeof section.details === 'string' ? (
                      <p className="italic text-muted-foreground/80 border-l-2 border-primary/40 pl-4 py-1">{section.details}</p>
                    ) : (
                      section.details
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                {t("docs.securityTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {t("docs.securityContent")}
              </p>
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">{t("docs.securityBadge")}</Badge>
            </CardContent>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-500/20 group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                {t("docs.performanceTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {t("docs.performanceContent")}
              </p>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">{t("docs.performanceBadge")}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
          <CardHeader className="p-10 pb-4 relative z-10">
            <CardTitle className="text-4xl font-black">{t("docs.needHelp")}</CardTitle>
          </CardHeader>
          <CardContent className="p-10 pt-0 relative z-10">
            <p className="mb-10 text-xl opacity-90 leading-relaxed max-w-2xl">
              {t("docs.supportTextDetailed")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-slate-100 rounded-xl px-10 h-12 font-bold shadow-xl">
                {t("docs.contactSupport")}
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-xl px-10 h-12 font-bold backdrop-blur-sm">
                {t("docs.docsPdf")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
