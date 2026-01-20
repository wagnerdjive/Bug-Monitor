import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/i18n";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

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
      registerMutation.mutate({ username, password, email }, {
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
        <ShieldCheck className="w-8 h-8 text-primary" />
        <span>TechMonitor</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? t("auth.login") : t("auth.register")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.username")}</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder={t("auth.enterUsername")}
                data-testid="input-username"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter email"
                  data-testid="input-email"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.password")}</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder={t("auth.enterPassword")}
                data-testid="input-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending || registerMutation.isPending}
              data-testid="button-submit"
            >
              {isLogin ? t("auth.login") : t("auth.register")}
            </Button>
            <Button 
              variant="ghost" 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="w-full text-sm hover:bg-transparent hover:text-primary"
              data-testid="button-toggle-auth"
            >
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            </Button>
          </form>
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
