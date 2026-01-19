import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowLeft } from "lucide-react";

// Translations for Auth
const authTranslations = {
  en: {
    back: "Back",
    login: "Login",
    register: "Register",
    createAccount: "Create Account",
    username: "Username",
    email: "Email",
    password: "Password",
    enterUsername: "Enter username",
    enterEmail: "Enter email",
    enterPassword: "Enter password",
    noAccount: "Don't have an account? Register",
    hasAccount: "Already have an account? Login",
    loginFailed: "Login failed",
    regFailed: "Registration failed",
    submitting: "Submitting...",
    poweredBy: "Powered by TechTarget",
  },
  pt: {
    back: "Voltar",
    login: "Entrar",
    register: "Registrar",
    createAccount: "Criar Conta",
    username: "Usuário",
    email: "E-mail",
    password: "Senha",
    enterUsername: "Digite o usuário",
    enterEmail: "Digite o e-mail",
    enterPassword: "Digite a senha",
    noAccount: "Não tem uma conta? Registre-se",
    hasAccount: "Já tem uma conta? Entre",
    loginFailed: "Falha no login",
    regFailed: "Falha no registro",
    submitting: "Enviando...",
    poweredBy: "Desenvolvido por TechTarget",
  }
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const lang = (localStorage.getItem("lang") as "en" | "pt") || "en";
  const t = authTranslations[lang];

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
            title: t.loginFailed,
            description: error.message,
            variant: "destructive",
          });
        }
      });
    } else {
      registerMutation.mutate({ username, password, email }, {
        onError: (error: Error) => {
          toast({
            title: t.regFailed,
            description: error.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <Link href="/">
        <Button variant="ghost" className="absolute top-8 left-8 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Button>
      </Link>

      <div className="flex items-center gap-2 font-display font-bold text-2xl text-foreground mb-8">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <span>TechMonitor</span>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? t.login : t.createAccount}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.username}</label>
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder={t.enterUsername}
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.email}</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder={t.enterEmail}
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.password}</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder={t.enterPassword}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending || registerMutation.isPending}
            >
              {isLogin ? t.login : t.register}
            </Button>
            <Button 
              variant="ghost" 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="w-full text-sm hover:bg-transparent hover:text-primary"
            >
              {isLogin ? t.noAccount : t.hasAccount}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">
          {t.poweredBy}
        </p>
      </div>
    </div>
  );
}
