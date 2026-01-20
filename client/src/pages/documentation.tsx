import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { BookOpen, Code, Terminal, Shield, Cpu, Layers } from "lucide-react";

export default function Documentation() {
  const { t } = useTranslation();

  const sections = [
    {
      title: "Introduction",
      icon: BookOpen,
      content: "TechMonitor is a real-time error tracking and performance monitoring platform designed for modern development teams. It provides deep visibility into application errors, allowing you to fix issues before they impact your users."
    },
    {
      title: "Getting Started",
      icon: Terminal,
      content: "To start monitoring your application, create a new project in the dashboard to receive your unique API key. Then, follow the platform-specific instructions to integrate our SDK into your codebase."
    },
    {
      title: "SDK Integration",
      icon: Code,
      content: "Our SDKs are designed to be non-intrusive and lightweight. They automatically capture unhandled exceptions, network errors, and console logs, providing a rich context for every event including breadcrumbs and device information."
    },
    {
      title: "Error Tracking",
      icon: Cpu,
      content: "Every error reported to TechMonitor includes a full stack trace, source maps support, and environment data. You can filter errors by severity, status, and custom tags to focus on what matters most."
    },
    {
      title: "Architecture",
      icon: Layers,
      content: "Built on a resilient Spring Boot backend and a responsive React frontend, TechMonitor ensures your data is processed quickly and presented clearly. We use PostgreSQL for reliable data persistence and session management."
    },
    {
      title: "Security",
      icon: Shield,
      content: "Security is built-in. All data ingestion is authenticated via API keys, and user access is managed through role-based access control. We use industry-standard encryption for data at rest and in transit."
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to integrate, monitor, and scale with TechMonitor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, idx) => (
            <Card key={idx} className="hover-elevate transition-all">
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
            <CardTitle>Need more help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our technical support team is available for enterprise customers. For community support, please check our GitHub discussions.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-primary-foreground text-primary rounded-md font-medium text-sm">
                Contact Support
              </div>
              <div className="px-4 py-2 border border-primary-foreground rounded-md font-medium text-sm">
                Join Community
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
