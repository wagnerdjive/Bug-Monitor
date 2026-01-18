import { useRoute } from "wouter";
import { useEvent } from "@/hooks/use-events";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Monitor, Tag, Share2, Activity } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function EventDetails() {
  const [, params] = useRoute("/events/:id");
  const id = Number(params?.id);
  const { data: event, isLoading } = useEvent(id);

  if (isLoading) return <Layout><div>Loading...</div></Layout>;
  if (!event) return <Layout><div>Event not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href={`/projects/${event.projectId}`}>
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Button>
        </Link>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Badge variant="destructive" className="mb-2 uppercase text-[10px] tracking-widest font-bold">
                {event.type}
              </Badge>
              <h1 className="text-2xl font-bold font-mono break-all">{event.message}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {format(new Date(event.occurredAt!), "MMM d, yyyy h:mm a")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  ID: {event.id}
                </span>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Stack Trace
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-black/50 overflow-x-auto p-6 font-mono text-sm leading-relaxed border-t border-border">
                  {event.stackTrace ? (
                    <pre className="text-red-200">
                      {event.stackTrace}
                    </pre>
                  ) : (
                    <span className="text-muted-foreground italic">No stack trace available.</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breadcrumbs</CardTitle>
                <CardDescription>Actions leading up to this error</CardDescription>
              </CardHeader>
              <CardContent>
                {event.breadcrumbs ? (
                  <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                    {JSON.stringify(event.breadcrumbs, null, 2)}
                  </pre>
                ) : (
                  <div className="text-muted-foreground text-sm italic">No breadcrumbs recorded.</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {event.tags && Object.entries(event.tags as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="flex items-center text-sm border border-border rounded-md bg-muted/30 overflow-hidden">
                      <span className="px-2 py-1 bg-muted/50 border-r border-border text-muted-foreground font-medium">{k}</span>
                      <span className="px-2 py-1 font-mono text-foreground">{v}</span>
                    </div>
                  ))}
                  {!event.tags && <span className="text-muted-foreground text-sm">No tags</span>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="w-3 h-3" /> Device Info
                  </h4>
                  {event.deviceInfo ? (
                    <div className="space-y-2 text-sm">
                      {Object.entries(event.deviceInfo as Record<string, any>).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-border/50 pb-1 last:border-0">
                          <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  ) : <span className="text-muted-foreground text-sm">Unavailable</span>}
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> App Info
                  </h4>
                  {event.platformInfo ? (
                    <div className="space-y-2 text-sm">
                      {Object.entries(event.platformInfo as Record<string, any>).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-border/50 pb-1 last:border-0">
                          <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                          <span className="font-mono">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  ) : <span className="text-muted-foreground text-sm">Unavailable</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
