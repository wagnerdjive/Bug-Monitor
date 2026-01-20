import { useRoute, useSearch } from "wouter";
import { useProject, useDeleteProject } from "@/hooks/use-projects";
import { useProjectEvents, ErrorEvent } from "@/hooks/use-events";
import { Layout } from "@/components/layout";
import { SdkInstructions } from "@/components/sdk-instructions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertTriangle, 
  Trash2, 
  Activity, 
  Clock, 
  Play,
  Search,
  X,
  Filter,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

export default function ProjectDetails() {
  const [, params] = useRoute("/projects/:id");
  const searchString = useSearch();
  const projectId = Number(params?.id);
  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: events, isLoading: loadingEvents } = useProjectEvents({ projectId });
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSimulating, setIsSimulating] = useState(false);
  
  const urlParams = new URLSearchParams(searchString);
  const initialTab = urlParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter(event => {
      const matchesSearch = searchQuery === "" || 
        event.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.stackTrace && event.stackTrace.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
      const matchesType = typeFilter === "all" || event.type === typeFilter;
      return matchesSearch && matchesStatus && matchesSeverity && matchesType;
    });
  }, [events, searchQuery, statusFilter, severityFilter, typeFilter]);

  const events24h = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return events.filter(event => {
      const eventDate = new Date(event.occurredAt);
      return eventDate >= twentyFourHoursAgo;
    });
  }, [events]);

  const chartData = useMemo(() => {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    const buckets: Record<string, number> = {};
    hours.forEach(h => buckets[h] = 0);

    events24h.forEach(event => {
      const eventDate = new Date(event.occurredAt);
      const hour = eventDate.getHours();
      if (hour < 4) buckets['00:00']++;
      else if (hour < 8) buckets['04:00']++;
      else if (hour < 12) buckets['08:00']++;
      else if (hour < 16) buckets['12:00']++;
      else if (hour < 20) buckets['16:00']++;
      else buckets['20:00']++;
    });

    return hours.map(name => ({ name, errors: buckets[name] }));
  }, [events24h]);

  const stats = useMemo(() => {
    if (!events) return { unresolved: 0, critical: 0, resolved: 0 };
    return {
      unresolved: events.filter(e => e.status === "unresolved").length,
      critical: events.filter(e => e.severity === "critical" || e.severity === "high").length,
      resolved: events.filter(e => e.status === "resolved").length,
    };
  }, [events]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSeverityFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || severityFilter !== "all" || typeFilter !== "all";

  if (loadingProject) {
    return <Layout><div className="animate-pulse">{t("common.loading")}</div></Layout>;
  }

  if (!project) {
    return <Layout><div>{t("project.notFound")}</div></Layout>;
  }

  const simulateError = async () => {
    setIsSimulating(true);
    try {
      await apiRequest('POST', '/api/ingest', {
        apiKey: project.apiKey,
        type: 'error',
        message: 'Simulated UI Error: User profile failed to load',
        stackTrace: 'Error: Failed to load user data\n    at UserProfile.fetchData (UserProfile.tsx:42:15)\n    at async loadUser (api.ts:128:5)\n    at async App.componentDidMount (App.tsx:23:7)',
        deviceInfo: { model: 'Chrome Browser', os: 'Web Demo' },
        platformInfo: { version: '1.0.0', environment: 'development' },
        occurredAt: new Date().toISOString()
      });
      
      toast({
        title: t("common.success"),
        description: t("project.simulateSuccess"),
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "events"] });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("project.simulateFailed"),
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case "ignored": return <X className="w-3 h-3 text-gray-500" />;
      default: return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getTypeVariant = (type: string): "destructive" | "secondary" | "outline" => {
    switch (type) {
      case "error": return "destructive";
      case "warning": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold font-display" data-testid="text-project-name">{project.name}</h1>
              <Badge variant="secondary" className="uppercase text-xs tracking-wider font-semibold">
                {project.platform}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm font-mono">ID: {project.id}</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={simulateError}
              disabled={isSimulating}
              data-testid="button-simulate-error"
            >
              <Play className="w-4 h-4" />
              {isSimulating ? t("project.simulating") : t("project.simulateError")}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" data-testid="button-delete-project">
                  <Trash2 className="w-4 h-4" />
                  {t("common.delete")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("project.deleteConfirm")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("project.deleteWarning")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteProject.mutate(project.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {t("common.delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
            <TabsTrigger value="overview" className="gap-2" data-testid="tab-overview">
              <Activity className="w-4 h-4 hidden sm:inline" /> {t("project.overview")}
            </TabsTrigger>
            <TabsTrigger value="issues" className="gap-2" data-testid="tab-issues">
              <AlertTriangle className="w-4 h-4 hidden sm:inline" /> {t("project.issues")}
            </TabsTrigger>
            <TabsTrigger value="setup" className="gap-2" data-testid="tab-setup">
              {t("project.setup")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("project.totalEvents24h")}</CardDescription>
                  <CardTitle className="text-2xl md:text-3xl" data-testid="stat-events-24h">{events24h.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("project.unresolved")}</CardDescription>
                  <CardTitle className="text-2xl md:text-3xl text-red-500" data-testid="stat-unresolved">{stats.unresolved}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("project.criticalHigh")}</CardDescription>
                  <CardTitle className="text-2xl md:text-3xl text-orange-500" data-testid="stat-critical">{stats.critical}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{t("project.resolved")}</CardDescription>
                  <CardTitle className="text-2xl md:text-3xl text-green-500" data-testid="stat-resolved">{stats.resolved}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t("project.errorVolume")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#888" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="errors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("project.recentIssues")}</CardTitle>
                <CardDescription>{t("project.latestErrors")}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEvents ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-12 bg-muted rounded" />)}
                  </div>
                ) : events && events.length > 0 ? (
                  <div className="space-y-2">
                    {events.slice(0, 5).map((event) => (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`event-row-${event.id}`}>
                          {getStatusIcon(event.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge className={cn("text-[10px]", getSeverityColor(event.severity))}>
                            {event.severity}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    {t("project.noErrors")}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{t("project.allIssues")}</CardTitle>
                    <CardDescription>
                      {filteredEvents.length} {t("project.issuesOf")} {events?.length || 0}
                      {hasActiveFilters && ` ${t("project.issuesFiltered")}`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t("project.searchErrors")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[130px]" data-testid="select-status">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("project.allStatus")}</SelectItem>
                        <SelectItem value="unresolved">{t("status.unresolved")}</SelectItem>
                        <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
                        <SelectItem value="ignored">{t("status.ignored")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-[130px]" data-testid="select-severity">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("project.allSeverity")}</SelectItem>
                        <SelectItem value="critical">{t("severity.critical")}</SelectItem>
                        <SelectItem value="high">{t("severity.high")}</SelectItem>
                        <SelectItem value="medium">{t("severity.medium")}</SelectItem>
                        <SelectItem value="low">{t("severity.low")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[120px]" data-testid="select-type">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("project.allTypes")}</SelectItem>
                        <SelectItem value="error">{t("type.error")}</SelectItem>
                        <SelectItem value="warning">{t("type.warning")}</SelectItem>
                        <SelectItem value="info">{t("type.info")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1" data-testid="button-clear-filters">
                        <X className="w-4 h-4" />
                        {t("common.clear")}
                      </Button>
                    )}
                  </div>
                </div>

                {loadingEvents ? (
                  <div className="animate-pulse space-y-2">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-muted rounded" />)}
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="py-12 text-center border rounded-lg bg-muted/30 border-dashed">
                    {hasActiveFilters ? (
                      <>
                        <Filter className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="font-medium mb-1">{t("project.noMatchingIssues")}</h3>
                        <p className="text-sm text-muted-foreground">{t("project.tryAdjusting")}</p>
                        <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                          {t("project.clearFilters")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h3 className="font-medium mb-1">{t("project.noIssuesReported")}</h3>
                        <p className="text-sm text-muted-foreground">{t("project.everythingLooksGood")}</p>
                      </>
                    )}
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="rounded-md border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50%]">{t("project.errorColumn")}</TableHead>
                            <TableHead>{t("project.typeColumn")}</TableHead>
                            <TableHead>{t("project.severityColumn")}</TableHead>
                            <TableHead>{t("project.statusColumn")}</TableHead>
                            <TableHead>{t("project.whenColumn")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEvents.map((event) => (
                            <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" data-testid={`issue-row-${event.id}`}>
                              <TableCell className="font-medium max-w-[300px]">
                                <Link href={`/events/${event.id}`}>
                                  <div className="space-y-1">
                                    <div className="text-primary truncate">{event.message}</div>
                                    <div className="text-xs text-muted-foreground font-mono truncate">
                                      {event.stackTrace?.split('\n')[0] || t("project.noStackTrace")}
                                    </div>
                                  </div>
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant={getTypeVariant(event.type)}>
                                  {event.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={cn("text-[10px]", getSeverityColor(event.severity))}>
                                  {event.severity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  {getStatusIcon(event.status)}
                                  <span className="text-sm capitalize">{event.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(event.occurredAt), { addSuffix: true })}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <SdkInstructions project={project} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
