import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Shield, Target, ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/i18n";
import { useQuery } from "@tanstack/react-query";

interface FeatureFlags {
  keycloakEnabled: boolean;
  emailEnabled: boolean;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { loginMutation, registerMutation, user } = useAuth();

  // Auto-generate username from email
  useEffect(() => {
    if (!isLogin && email) {
      const prefix = email.split("@")[0];
      setUsername(prefix);
    }
  }, [email, isLogin]);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const { data: featureFlags } = useQuery<FeatureFlags>({
    queryKey: ["/api/feature-flags"],
  });

  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ username, password }, {
        onError: (error: Error) => {
          toast({
            title: t("auth.loginFailed"),
            description: error.message,
            variant: "destructive",
          });
        }
      });
    } else {
      if (password !== confirmPassword) {
        toast({
          title: t("auth.registerFailed"),
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      registerMutation.mutate({ username, password, confirmPassword, email, firstName, lastName }, {
        onError: (error: Error) => {
          toast({
            title: t("auth.registerFailed"),
            description: error.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
        </Link>
        <LanguageSelector />
      </div>

      <div className="flex items-center gap-2 font-display font-bold text-2xl text-foreground mb-8">
        <div className="relative flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
          <Target className="w-4 h-4 text-primary absolute" />
        </div>
        <span>TechMonitor</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}</CardTitle>
          <CardDescription>
            {isLogin ? t("auth.loginDescription") : t("auth.registerDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.username")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    placeholder={t("auth.enterUsername")}
                    className="pl-10"
                    data-testid="input-username"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("auth.firstName")}</label>
                    <Input 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder={t("auth.enterFirstName")}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("auth.lastName")}</label>
                    <Input 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder={t("auth.enterLastName")}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("auth.email")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder={t("auth.enterEmail")}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>
              </>
            )}

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

            {!isLogin && (
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
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending}
              data-testid="button-submit"
              variant="default"
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? t("auth.login") : t("auth.register")}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="link" 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm"
              data-testid="button-toggle-auth"
            >
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            </Button>
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
