import { useRoute } from "wouter";
import { useEvent, useUpdateEventStatus } from "@/hooks/use-events";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Clock, 
  Monitor, 
  Tag, 
  Activity, 
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  XCircle,
  RotateCcw
} from "lucide-react";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n";

export default function EventDetails() {
  const [, params] = useRoute("/events/:id");
  const id = Number(params?.id);
  const { data: event, isLoading, error } = useEvent(id);
  const updateStatus = useUpdateEventStatus();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: t("event.statusUpdated"),
            description: `${t("event.markedAs")} ${newStatus}`,
          });
        },
        onError: () => {
          toast({
            title: t("common.error"),
            description: t("event.updateFailed"),
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="h-12 w-3/4 bg-muted rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-muted rounded" />
              <div className="h-64 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t("event.eventNotFound")}</h2>
                <p className="text-muted-foreground mb-4">
                  {t("event.eventNotFoundDesc")}
                </p>
                <Link href="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("event.backToDashboard")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <AlertCircle className="w-4 h-4" />;
      case "low":
        return <Info className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-600 text-white";
      case "ignored":
        return "bg-gray-500 text-white";
      default:
        return "bg-red-600 text-white";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href={`/projects/${event.projectId}?tab=issues`}>
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground" data-testid="button-back-issues">
            <ArrowLeft className="w-4 h-4" />
            {t("event.backToIssues")}
          </Button>
        </Link>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={getTypeColor(event.type) as any} className="uppercase text-[10px] tracking-widest font-bold" data-testid="badge-type">
                  {event.type}
                </Badge>
                <Badge className={cn("uppercase text-[10px] tracking-widest font-bold", getSeverityColor(event.severity))} data-testid="badge-severity">
                  {getSeverityIcon(event.severity)}
                  <span className="ml-1">{event.severity}</span>
                </Badge>
                <Badge className={cn("uppercase text-[10px] tracking-widest font-bold", getStatusColor(event.status))} data-testid="badge-status">
                  {event.status === "resolved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {event.status}
                </Badge>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-mono break-all" data-testid="text-message">{event.message}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5" data-testid="text-occurred-at">
                  <Clock className="w-4 h-4" />
                  {format(new Date(event.occurredAt), "MMM d, yyyy h:mm:ss a")}
                </span>
                <span className="flex items-center gap-1.5 text-xs" data-testid="text-time-ago">
                  ({formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })})
                </span>
                <span className="flex items-center gap-1.5" data-testid="text-event-id">
                  <Activity className="w-4 h-4" />
                  ID: {event.id}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {event.status !== "resolved" && (
                <Button 
                  variant="default" 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange("resolved")}
                  disabled={updateStatus.isPending}
                  data-testid="button-resolve"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t("event.markResolved")}
                </Button>
              )}
              {event.status === "resolved" && (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleStatusChange("unresolved")}
                  disabled={updateStatus.isPending}
                  data-testid="button-reopen"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("event.reopen")}
                </Button>
              )}
              {event.status !== "ignored" && (
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={() => handleStatusChange("ignored")}
                  disabled={updateStatus.isPending}
                  data-testid="button-ignore"
                >
                  <XCircle className="w-4 h-4" />
                  {t("event.ignore")}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2">
                  {t("event.stackTrace")}
                </CardTitle>
                {event.stackTrace && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(event.stackTrace || "")}
                    data-testid="button-copy-stack"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-1 text-xs">{copied ? t("common.copied") : t("common.copy")}</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] md:h-[400px]">
                  <div className="bg-zinc-950 p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed border-t border-border">
                    {event.stackTrace ? (
                      <pre className="text-red-300 whitespace-pre-wrap break-all" data-testid="text-stack-trace">
                        {event.stackTrace}
                      </pre>
                    ) : (
                      <span className="text-muted-foreground italic">{t("event.noStackTraceAvailable")}</span>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {event.breadcrumbs && Array.isArray(event.breadcrumbs) && event.breadcrumbs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("event.breadcrumbs")}</CardTitle>
                  <CardDescription>{t("event.actionsLeading")} ({event.breadcrumbs.length} {t("event.items")})</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {event.breadcrumbs.map((crumb: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-sm p-2 bg-muted/30 rounded">
                          <span className="text-muted-foreground text-xs font-mono">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                              {typeof crumb === "string" ? crumb : JSON.stringify(crumb, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Monitor className="w-4 h-4" /> {t("event.deviceInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.deviceInfo && Object.keys(event.deviceInfo).length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {Object.entries(event.deviceInfo).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-muted-foreground capitalize shrink-0">{k.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-right truncate" title={String(v)}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm italic">{t("event.noDeviceInfo")}</span>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" /> {t("event.appInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.platformInfo && Object.keys(event.platformInfo).length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {Object.entries(event.platformInfo).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2 border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <span className="text-muted-foreground capitalize shrink-0">{k.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-right truncate" title={String(v)}>{String(v)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm italic">{t("event.noAppInfo")}</span>
                )}
              </CardContent>
            </Card>

            {event.tags && Object.keys(event.tags).length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t("event.tags")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(event.tags).map(([k, v]) => (
                      <div key={k} className="flex items-center text-xs border border-border rounded-md bg-muted/30 overflow-hidden">
                        <span className="px-2 py-1 bg-muted/50 border-r border-border text-muted-foreground font-medium">{k}</span>
                        <span className="px-2 py-1 font-mono text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t("event.timestamps")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{t("event.occurred")}</span>
                  <span className="font-mono text-xs">{format(new Date(event.occurredAt), "yyyy-MM-dd HH:mm:ss")}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{t("event.received")}</span>
                  <span className="font-mono text-xs">{format(new Date(event.createdAt), "yyyy-MM-dd HH:mm:ss")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
