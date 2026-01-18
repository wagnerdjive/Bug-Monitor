import { useProjects } from "@/hooks/use-projects";
import { Layout } from "@/components/layout";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowRight, Box, Activity, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your applications and monitor error feeds.</p>
        </div>
        <CreateProjectDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl bg-card border border-border/50" />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card/30">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first project to start tracking errors and performance issues.
          </p>
          <CreateProjectDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group block">
              <Card className="h-full hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer bg-card border-border/60">
                <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{project.platform}</span>
                      <span>•</span>
                      <span>Created {formatDistanceToNow(new Date(project.createdAt!), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    ID: {project.id}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Activity className="w-3 h-3" /> 24h Errors
                      </span>
                      <p className="text-2xl font-bold font-mono text-red-400">
                        {/* Mock data for now since stats are optional in get request */}
                        0
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> Users
                      </span>
                      <p className="text-2xl font-bold font-mono">0</p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                    View Project <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
