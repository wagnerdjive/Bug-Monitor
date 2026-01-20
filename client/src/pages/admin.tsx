import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useProjects } from "@/hooks/use-projects";
import { Users, Mail, UserPlus, FolderPlus, Copy, Check, Shield, Clock, AlertCircle } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface Invitation {
  id: number;
  email: string;
  token: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function Admin() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: invitations, isLoading: invitationsLoading } = useQuery<Invitation[]>({
    queryKey: ["/api/admin/invitations"],
  });

  const { data: projects } = useProjects();

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/admin/invitations", { email });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invitations"] });
      setInviteEmail("");
      setInviteDialogOpen(false);
      toast({
        title: t("admin.inviteSent"),
        description: t("admin.inviteSentDesc"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.message || t("admin.inviteFailed"),
        variant: "destructive",
      });
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ userId, projectId }: { userId: number; projectId: number }) => {
      const res = await apiRequest("POST", "/api/admin/projects/assign", {
        userId,
        projectId,
        role: "VIEWER",
      });
      return res.json();
    },
    onSuccess: () => {
      setAssignDialogOpen(false);
      setSelectedUserId(null);
      setSelectedProjectId("");
      toast({
        title: t("admin.userAssigned"),
        description: t("admin.userAssignedDesc"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.message || t("admin.assignFailed"),
        variant: "destructive",
      });
    },
  });

  const copyInviteLink = (token: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/auth?invite=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      inviteMutation.mutate(inviteEmail.trim());
    }
  };

  const handleAssign = () => {
    if (selectedUserId && selectedProjectId) {
      assignMutation.mutate({
        userId: selectedUserId,
        projectId: parseInt(selectedProjectId),
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            {t("admin.title")}
          </h1>
          <p className="text-muted-foreground">{t("admin.description")}</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
            <Users className="w-4 h-4" />
            {t("admin.users")}
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2" data-testid="tab-invitations">
            <Mail className="w-4 h-4" />
            {t("admin.invitations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("admin.usersList")}</h2>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-invite-user">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t("admin.inviteUser")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("admin.inviteUser")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">{t("admin.email")}</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder={t("admin.enterEmail")}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      data-testid="input-invite-email"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button 
                    onClick={handleInvite} 
                    disabled={!inviteEmail.trim() || inviteMutation.isPending}
                    data-testid="button-send-invite"
                  >
                    {inviteMutation.isPending ? t("common.loading") : t("admin.sendInvite")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {usersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users?.map((user) => (
                <Card key={user.id} data-testid={`card-user-${user.id}`}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.username}</span>
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    <Dialog open={assignDialogOpen && selectedUserId === user.id} onOpenChange={(open) => {
                      setAssignDialogOpen(open);
                      if (open) setSelectedUserId(user.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" data-testid={`button-assign-${user.id}`}>
                          <FolderPlus className="w-4 h-4 mr-2" />
                          {t("admin.assignProject")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("admin.assignToProject")}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>{t("admin.selectProject")}</Label>
                            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                              <SelectTrigger data-testid="select-project">
                                <SelectValue placeholder={t("admin.selectProjectPlaceholder")} />
                              </SelectTrigger>
                              <SelectContent>
                                {projects?.map((project) => (
                                  <SelectItem key={project.id} value={String(project.id)}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                            {t("common.cancel")}
                          </Button>
                          <Button 
                            onClick={handleAssign} 
                            disabled={!selectedProjectId || assignMutation.isPending}
                            data-testid="button-confirm-assign"
                          >
                            {assignMutation.isPending ? t("common.loading") : t("admin.assign")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("admin.invitationsList")}</h2>
          </div>

          {invitationsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : invitations?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t("admin.noInvitations")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {invitations?.map((invitation) => (
                <Card key={invitation.id} data-testid={`card-invitation-${invitation.id}`}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invitation.email}</span>
                          <Badge variant={invitation.status === "PENDING" ? "outline" : invitation.status === "ACCEPTED" ? "default" : "secondary"}>
                            {invitation.status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
                            {invitation.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {t("admin.expires")}: {new Date(invitation.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {invitation.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invitation.token)}
                        data-testid={`button-copy-invite-${invitation.id}`}
                      >
                        {copiedToken === invitation.token ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            {t("common.copied")}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            {t("admin.copyLink")}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
