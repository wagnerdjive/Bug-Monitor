import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Target, ArrowLeft, Lock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/i18n";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface InvitationData {
  email: string;
  token: string;
}

export default function AcceptInvite() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const { data: invitation, isLoading, error } = useQuery<InvitationData>({
    queryKey: [`/api/register/invite/${token}`],
    enabled: !!token,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; firstName: string; lastName: string }) => {
      const response = await apiRequest("POST", `/api/register/invite/${token}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data);
      toast({
        title: t("auth.registrationSuccess"),
        description: t("auth.welcomeToTeam"),
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: t("auth.registerFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t("auth.registerFailed"),
        description: t("auth.passwordsMismatch"),
        variant: "destructive",
      });
      return;
    }

    if (!invitation) return;

    const username = invitation.email.split("@")[0];
    
    registerMutation.mutate({
      username,
      password,
      firstName,
      lastName,
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-invalid-link">{t("invite.invalidLink")}</CardTitle>
            <CardDescription data-testid="text-no-token">{t("invite.noToken")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/auth">
              <Button data-testid="button-login-no-token">{t("auth.login")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="spinner-validating" />
        <p className="mt-4 text-muted-foreground" data-testid="text-validating">{t("invite.validating")}</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl" data-testid="text-invalid-link-error">{t("invite.invalidLink")}</CardTitle>
            <CardDescription data-testid="text-error-message">
              {error instanceof Error ? error.message : t("invite.expiredOrUsed")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/auth">
              <Button data-testid="button-login-error">{t("auth.login")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
        <LanguageSelector />
      </div>

      <div className="flex items-center gap-2 font-display font-bold text-2xl text-foreground mb-8">
        <div className="relative flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
          <Target className="w-3.5 h-3.5 text-primary absolute" />
        </div>
        <span>Logra</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl" data-testid="text-accept-title">{t("invite.acceptTitle")}</CardTitle>
          <CardDescription data-testid="text-accept-description">
            {t("invite.acceptDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">{t("invite.emailLabel")}</p>
            <p className="font-medium" data-testid="text-invitation-email">{invitation.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.firstName")}</label>
                <Input 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder={t("auth.enterFirstName")}
                  required
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.lastName")}</label>
                <Input 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder={t("auth.enterLastName")}
                  required
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder={t("auth.enterPassword")}
                  className="pl-10"
                  data-testid="input-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.confirmPassword")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder={t("auth.enterConfirmPassword")}
                  className="pl-10"
                  data-testid="input-confirm-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={registerMutation.isPending}
              data-testid="button-accept-invite"
            >
              {registerMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("invite.acceptButton")}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/auth">
              <Button variant="ghost" className="text-sm" data-testid="link-already-have-account">
                {t("auth.hasAccount")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">
          POWERED BY TECHTARGET
        </p>
      </div>
    </div>
  );
}
