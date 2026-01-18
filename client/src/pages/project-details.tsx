import { useRoute } from "wouter";
import { useProject, useDeleteProject } from "@/hooks/use-projects";
import { useProjectEvents } from "@/hooks/use-events";
import { Layout } from "@/components/layout";
import { SdkInstructions } from "@/components/sdk-instructions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Settings, 
  Activity, 
  Clock, 
  MoreHorizontal 
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

export default function ProjectDetails() {
  const [, params] = useRoute("/projects/:id");
  const projectId = Number(params?.id);
  const { data: project, isLoading: loadingProject } = useProject(projectId);
  const { data: events, isLoading: loadingEvents } = useProjectEvents({ projectId });
  const deleteProject = useDeleteProject();

  if (loadingProject) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!project) {
    return <Layout><div>Project not found</div></Layout>;
  }

  // Mock data for chart since backend doesn't aggregate yet
  const chartData = [
    { name: '00:00', errors: 0 },
    { name: '04:00', errors: 0 },
    { name: '08:00', errors: 0 },
    { name: '12:00', errors: 0 },
    { name: '16:00', errors: 0 },
    { name: '20:00', errors: 0 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-display">{project.name}</h1>
              <Badge variant="secondary" className="uppercase text-xs tracking-wider font-semibold">
                {project.platform}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm font-mono">ID: {project.id}</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your project
                  and all associated error data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteProject.mutate(project.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Events (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-mono">
                    {events?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
                </CardHeader>
                <CardContent className="h-[120px]">
                   <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                        itemStyle={{ color: '#e4e4e7' }}
                      />
                      <XAxis dataKey="name" hide />
                      <Bar dataKey="errors" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                  <CardDescription>Get started by integrating the SDK</CardDescription>
                </CardHeader>
                <CardContent>
                  <SdkInstructions project={project} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
                <CardDescription>Real-time feed of exceptions from your app.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEvents ? (
                  <div className="py-8 text-center text-muted-foreground">Loading events...</div>
                ) : events?.length === 0 ? (
                  <div className="py-12 text-center border rounded-lg bg-zinc-900/50 border-dashed">
                    <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium mb-1">No issues reported</h3>
                    <p className="text-sm text-muted-foreground">Everything looks good! Or the SDK isn't installed yet.</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Error</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Last Seen</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events?.map((event) => (
                          <TableRow key={event.id} className="group cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium max-w-[300px]">
                              <Link href={`/events/${event.id}`}>
                                <div className="space-y-1">
                                  <div className="text-primary truncate">{event.message}</div>
                                  <div className="text-xs text-muted-foreground font-mono truncate">
                                    {event.stackTrace?.split('\n')[0] || 'No stack trace'}
                                  </div>
                                </div>
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant={event.type === 'error' ? 'destructive' : 'secondary'}>
                                {event.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(event.occurredAt!), { addSuffix: true })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>Manage your project configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="font-medium text-sm">Project Name</div>
                  <div className="p-3 bg-muted rounded-md text-sm">{project.name}</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium text-sm">Platform</div>
                  <div className="p-3 bg-muted rounded-md text-sm capitalize">{project.platform}</div>
                </div>
                <div className="grid gap-2">
                  <div className="font-medium text-sm">API Key</div>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">{project.apiKey}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
