import { Project } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SdkInstructionsProps {
  project: Project;
  lang?: "en" | "pt"; // Opcional, com fallback para "en"
}

export function SdkInstructions({
  project,
  lang = "en",
}: SdkInstructionsProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopy = (tab: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 1800);
  };

  // Proteção: fallback seguro para inglês
  const safeLang = lang === "pt" ? "pt" : "en";

  // Traduções completas
  const t = {
    en: {
      title: "SDK Integration Instructions",
      apiKeyLabel: "API Key",
      tipTitle: "Important Tip",
      tipText:
        "Define <code>BACKEND_BASE_URL</code> in your <code>.env</code> file (or equivalent: <code>local.properties</code> for Android, <code>Info.plist</code> for iOS, etc.). This allows switching between development, staging, and production by changing only the .env file, without modifying code.",
      featuresTitle: "Key Features",
      copy: "Copy",
      copied: "Copied",
      tabs: {
        androidKotlin: "Android (Kotlin)",
        androidJava: "Android (Java)",
        iosSwift: "iOS (Swift)",
        python: "Python",
        typescript: "TypeScript",
        javaBackend: "Java Backend",
      },
      details: {
        androidKotlin: [
          "BACKEND_BASE_URL read from .env/local.properties → easy environment switch",
          "Automatic crash capture via UncaughtExceptionHandler",
          "Offline support: persistent queue in SharedPreferences (max 100 items)",
          "Automatic retry: BroadcastReceiver detects internet",
        ],
        androidJava: [
          "Same variable as Kotlin – defined in .env/local.properties",
          "Automatic capture and offline support identical to Kotlin",
        ],
        iosSwift: [
          "BACKEND_BASE_URL read from Info.plist / .xcconfig",
          "Automatic crash capture: NSUncaughtExceptionHandler + signal handlers",
        ],
        python: [
          "BACKEND_BASE_URL read exclusively from .env",
          "Change server by editing only .env",
        ],
        typescript: [
          "BACKEND_BASE_URL read from .env",
          "Use VITE_ prefix for Vite/React",
        ],
        javaBackend: [
          "BACKEND_BASE_URL read from .env or real environment variables",
          "Throw error if not defined",
          "Secure and flexible for dev/staging/prod",
        ],
      },
    },
    pt: {
      title: "Instruções de Integração do SDK",
      apiKeyLabel: "Chave API",
      tipTitle: "Dica Importante",
      tipText:
        "Defina <code>BACKEND_BASE_URL</code> no seu arquivo <code>.env</code> (ou equivalente: <code>local.properties</code> no Android, <code>Info.plist</code> no iOS, etc.). Assim você muda o servidor (localhost, staging, produção) alterando apenas o .env, sem tocar no código.",
      featuresTitle: "Principais Características",
      copy: "Copiar",
      copied: "Copiado",
      tabs: {
        androidKotlin: "Android (Kotlin)",
        androidJava: "Android (Java)",
        iosSwift: "iOS (Swift)",
        python: "Python",
        typescript: "TypeScript",
        javaBackend: "Java Backend",
      },
      details: {
        androidKotlin: [
          "BACKEND_BASE_URL lido do .env/local.properties → troca fácil por ambiente",
          "Captura automática de crashes via UncaughtExceptionHandler",
          "Suporte offline: queue persistente em SharedPreferences (máx 100 itens)",
          "Retry automático: BroadcastReceiver detecta internet",
        ],
        androidJava: [
          "Mesma variável do Kotlin – definida no .env/local.properties",
          "Captura automática e suporte offline iguais ao Kotlin",
        ],
        iosSwift: [
          "BACKEND_BASE_URL lido do Info.plist / .xcconfig",
          "Captura automática: NSUncaughtExceptionHandler + signals",
        ],
        python: [
          "BACKEND_BASE_URL lido exclusivamente do .env",
          "Troque o servidor alterando apenas o .env",
        ],
        typescript: [
          "BACKEND_BASE_URL lido do .env",
          "Use prefixo VITE_ no Vite/React",
        ],
        javaBackend: [
          "BACKEND_BASE_URL lido do .env ou variáveis de ambiente reais",
          "Lance exceção se não estiver definido",
          "Seguro e flexível para dev/staging/prod",
        ],
      },
    },
  }[safeLang];

  const tabs = [
    {
      value: "android-kotlin",
      label: t.tabs.androidKotlin,
      code: `// 1. Defina no local.properties (raiz do projeto Android)
// backend.base.url=https://seuservidor.com
// OU use .env e leia via Gradle plugin

// 2. No build.gradle.kts (module app)
android {
    defaultConfig {
        buildConfigField("String", "BACKEND_BASE_URL", 
            "\"\${project.property(\\"backend.base.url\\")}\"")
    }
}

// 3. Inicialização (MyApplication.kt)
import android.app.Application
import com.bugmonitor.sdk.BugMonitor

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        BugMonitor.init(
            context = this,
            apiKey = "${project.apiKey}",
            baseUrl = BuildConfig.BACKEND_BASE_URL   // ← valor vem do .env / local.properties
        )
    }
}

// Registre no manifest: android:name=".MyApplication"`,
      details: t.details.androidKotlin,
    },
    {
      value: "android-java",
      label: t.tabs.androidJava,
      code: `// Mesma configuração no build.gradle
buildConfigField "String", "BACKEND_BASE_URL", 
    "\"\${project.property(\\"backend.base.url\\")}\""

// Inicialização (MyApplication.java)
import android.app.Application;
import com.bugmonitor.sdk.BugMonitor;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        BugMonitor.init(this, "${project.apiKey}", BuildConfig.BACKEND_BASE_URL);
    }
}`,
      details: t.details.androidJava,
    },
    {
      value: "ios-swift",
      label: t.tabs.iosSwift,
      code: `// Defina no Info.plist (equivalente ao .env no iOS)
// <key>BACKEND_BASE_URL</key>
// <string>https://seuservidor.com</string>

// No código:
let baseUrl = Bundle.main.object(forInfoDictionaryKey: "BACKEND_BASE_URL") 
    as? String ?? "https://seuservidor.com"  // fallback

BugMonitor.initialize(
    apiKey: "${project.apiKey}",
    baseUrl: baseUrl
)`,
      details: t.details.iosSwift,
    },
    {
      value: "python",
      label: t.tabs.python,
      code: `import os
from dotenv import load_dotenv

# Carrega .env automaticamente (pip install python-dotenv)
load_dotenv()

BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
if not BACKEND_BASE_URL:
    raise ValueError("BACKEND_BASE_URL não definido no .env")

print("Servidor:", BACKEND_BASE_URL)

// Uso
requests.post(f"{BACKEND_BASE_URL}/api/ingest", json=event)`,
      details: t.details.python,
    },
    {
      value: "typescript",
      label: t.tabs.typescript,
      code: `// .env na raiz
// VITE_BACKEND_BASE_URL=https://seuservidor.com   (Vite/React)
// BACKEND_BASE_URL=https://seuservidor.com         (Node)

const BACKEND_BASE_URL = 
  import.meta.env.VITE_BACKEND_BASE_URL || 
  process.env.BACKEND_BASE_URL;

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL não definido no .env");
}

console.log("Backend:", BACKEND_BASE_URL);

// Uso
fetch(\`\${BACKEND_BASE_URL}/api/ingest\`, { ... })`,
      details: t.details.typescript,
    },
    {
      value: "java-backend",
      label: t.tabs.javaBackend,
      code: `// .env na raiz
BACKEND_BASE_URL=https://seuservidor.com
BUGMONITOR_API_KEY=${project.apiKey}

// Carregamento com java-dotenv
import io.github.cdimascio.dotenv.Dotenv;

public class Config {
    private static final Dotenv dotenv = Dotenv.load();

    public static String getBaseUrl() {
        return dotenv.get("BACKEND_BASE_URL");
    }
}

// Uso
String baseUrl = Config.getBaseUrl();`,
      details: t.details.javaBackend,
    },
  ];

  return (
    <div className="space-y-8 bg-gradient-to-b from-zinc-950 to-white rounded-2xl p-6 border border-zinc-800/50 shadow-2xl">
      {/* Cabeçalho premium */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-800/60">
        <h3 className="text-2xl font-bold tracking-tight text-white">
          {t.title}
        </h3>
        <div className="flex items-center gap-4 bg-zinc-900/80 px-5 py-2.5 rounded-full border border-zinc-700/50 shadow-inner">
          <span className="text-sm font-medium text-zinc-300">
            {t.apiKeyLabel}:
          </span>
          <code className="text-indigo-400 font-mono text-base">
            {project.apiKey}
          </code>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-950/30 to-emerald-950/20 p-5 rounded-xl border border-indigo-800/40 shadow-md">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          {t.tipTitle}
        </h4>
        <p
          className="text-zinc-200 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: t.tipText }}
        />
      </div>

      <Tabs defaultValue="android-kotlin">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-transparent border-b border-zinc-800 pb-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg data-[state=active]:bg-indigo-950/40 data-[state=active]:text-indigo-50 data-[state=active]:shadow-md data-[state=active]:border-indigo-800/50 border border-transparent hover:border-zinc-700 transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <br />
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <div className="relative rounded-xl overflow-hidden border border-zinc-700/60 bg-zinc-950/80 backdrop-blur-sm shadow-lg">
              <div className="absolute right-4 top-4 z-10 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white",
                    copiedTab === tab.value &&
                      "border-emerald-600 text-emerald-400",
                  )}
                  onClick={() => handleCopy(tab.value, tab.code)}
                >
                  {copiedTab === tab.value ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedTab === tab.value ? t.copied : t.copy}
                </Button>
              </div>

              <pre className="p-6 pt-16 text-sm font-mono text-zinc-200 leading-6 overflow-x-auto whitespace-pre">
                <code>{tab.code.trim()}</code>
              </pre>
            </div>

            <div className="mt-6 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-sm">
              <h4 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                {t.featuresTitle}
              </h4>
              <ul className="space-y-3 text-zinc-300">
                {tab.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-center text-sm text-zinc-500 pt-6 border-t border-zinc-800">
        {safeLang === "en"
          ? "All platforms read the URL from .env for easy environment switching"
          : "Todas as plataformas leem a URL do .env para facilitar a troca de ambiente"}
      </div>
    </div>
  );
}
