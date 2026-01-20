import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  userId: number;
  name: string;
  platform: string | null;
  apiKey: string;
  createdAt: string;
}

interface SdkInstructionsProps {
  project: Project;
  lang?: "en" | "pt";
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

  const safeLang = lang === "pt" ? "pt" : "en";

  const t = {
    en: {
      title: "SDK Integration",
      apiKeyLabel: "API Key",
      endpointLabel: "Endpoint",
      tipTitle: "Quick Start",
      tipText:
        "Send errors to TechMonitor using a simple HTTP POST request. Include your API key in the request body along with error details.",
      featuresTitle: "Payload Fields",
      copy: "Copy",
      copied: "Copied",
      tabs: {
        javascript: "JavaScript",
        python: "Python",
        kotlin: "Kotlin",
        swift: "Swift",
        java: "Java",
        curl: "cURL",
      },
      details: {
        javascript: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
        python: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
        kotlin: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
        swift: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
        java: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
        curl: [
          "apiKey (required): Your project API key",
          "message (required): Error message description",
          "level: 'error', 'warning', or 'info'",
          "stackTrace: Full stack trace string",
          "deviceInfo: { model, os } object",
          "occurredAt: ISO timestamp of when error occurred",
        ],
      },
    },
    pt: {
      title: "Integracao SDK",
      apiKeyLabel: "Chave API",
      endpointLabel: "Endpoint",
      tipTitle: "Inicio Rapido",
      tipText:
        "Envie erros para o TechMonitor usando uma requisicao HTTP POST simples. Inclua sua chave API no corpo da requisicao junto com os detalhes do erro.",
      featuresTitle: "Campos do Payload",
      copy: "Copiar",
      copied: "Copiado",
      tabs: {
        javascript: "JavaScript",
        python: "Python",
        kotlin: "Kotlin",
        swift: "Swift",
        java: "Java",
        curl: "cURL",
      },
      details: {
        javascript: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
        python: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
        kotlin: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
        swift: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
        java: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
        curl: [
          "apiKey (obrigatorio): Sua chave API do projeto",
          "message (obrigatorio): Descricao da mensagem de erro",
          "level: 'error', 'warning', ou 'info'",
          "stackTrace: String completa do stack trace",
          "deviceInfo: Objeto { model, os }",
          "occurredAt: Timestamp ISO de quando o erro ocorreu",
        ],
      },
    },
  }[safeLang];

  const ingestUrl = `${window.location.origin}/api/ingest`;

  const tabs = [
    {
      value: "javascript",
      label: t.tabs.javascript,
      code: `// TechMonitor Error Reporter - JavaScript/TypeScript
const TECHMONITOR_API_KEY = "${project.apiKey}";
const TECHMONITOR_URL = "${ingestUrl}";

async function reportError(error) {
  try {
    const response = await fetch(TECHMONITOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: TECHMONITOR_API_KEY,
        message: error.message || String(error),
        level: "error",
        stackTrace: error.stack || new Error().stack,
        deviceInfo: {
          model: navigator.userAgent,
          os: navigator.platform
        },
        occurredAt: new Date().toISOString()
      })
    });
    console.log("Error reported:", response.ok);
  } catch (e) {
    console.error("Failed to report error:", e);
  }
}

// Global error handler
window.onerror = (msg, url, line, col, error) => {
  reportError(error || new Error(msg));
};

// Promise rejection handler
window.onunhandledrejection = (event) => {
  reportError(event.reason);
};

// Manual usage
try {
  // your code
} catch (error) {
  reportError(error);
}`,
      details: t.details.javascript,
    },
    {
      value: "python",
      label: t.tabs.python,
      code: `# TechMonitor Error Reporter - Python
import requests
import traceback
import platform
from datetime import datetime

TECHMONITOR_API_KEY = "${project.apiKey}"
TECHMONITOR_URL = "${ingestUrl}"

def report_error(error, level="error"):
    """Report an error to TechMonitor"""
    try:
        payload = {
            "apiKey": TECHMONITOR_API_KEY,
            "message": str(error),
            "level": level,
            "stackTrace": traceback.format_exc(),
            "deviceInfo": {
                "model": platform.node(),
                "os": f"{platform.system()} {platform.release()}"
            },
            "occurredAt": datetime.utcnow().isoformat() + "Z"
        }
        response = requests.post(
            TECHMONITOR_URL,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        print(f"Error reported: {response.ok}")
    except Exception as e:
        print(f"Failed to report error: {e}")

# Usage
try:
    # your code
    result = 1 / 0
except Exception as e:
    report_error(e)
    raise`,
      details: t.details.python,
    },
    {
      value: "kotlin",
      label: t.tabs.kotlin,
      code: `// TechMonitor Error Reporter - Kotlin/Android
// Add to your build.gradle: implementation("com.squareup.okhttp3:okhttp:4.12.0")
// implementation("org.json:json:20231013")

import android.os.Build
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

object TechMonitor {
    private const val API_KEY = "${project.apiKey}"
    private const val INGEST_URL = "${ingestUrl}"
    private val client = OkHttpClient()
    private val JSON = "application/json".toMediaType()

    fun reportError(error: Throwable, level: String = "error") {
        val payload = JSONObject().apply {
            put("apiKey", API_KEY)
            put("message", error.message ?: "Unknown error")
            put("level", level)
            put("stackTrace", error.stackTraceToString())
            put("deviceInfo", JSONObject().apply {
                put("model", Build.MODEL)
                put("os", "Android " + Build.VERSION.RELEASE)
            })
            put("occurredAt", SimpleDateFormat(
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US
            ).apply { timeZone = TimeZone.getTimeZone("UTC") }.format(Date()))
        }

        val request = Request.Builder()
            .url(INGEST_URL)
            .post(payload.toString().toRequestBody(JSON))
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
            }
            override fun onResponse(call: Call, response: Response) {
                println("Error reported: " + response.isSuccessful)
            }
        })
    }
}

// Usage
try {
    // your code
} catch (e: Exception) {
    TechMonitor.reportError(e)
    throw e
}`,
      details: t.details.kotlin,
    },
    {
      value: "swift",
      label: t.tabs.swift,
      code: `// TechMonitor Error Reporter - Swift/iOS
import Foundation
import UIKit

class TechMonitor {
    static let apiKey = "${project.apiKey}"
    static let ingestURL = URL(string: "${ingestUrl}")!
    
    static func reportError(_ error: Error, level: String = "error") {
        let device = UIDevice.current
        let payload: [String: Any] = [
            "apiKey": apiKey,
            "message": error.localizedDescription,
            "level": level,
            "stackTrace": Thread.callStackSymbols.joined(separator: "\\n"),
            "deviceInfo": [
                "model": device.model,
                "os": device.systemName + " " + device.systemVersion
            ],
            "occurredAt": ISO8601DateFormatter().string(from: Date())
        ]
        
        var request = URLRequest(url: ingestURL)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: payload)
        
        URLSession.shared.dataTask(with: request) { _, response, err in
            if let err = err {
                print("Failed to report error: " + err.localizedDescription)
            } else {
                print("Error reported successfully")
            }
        }.resume()
    }
}

// Usage
do {
    // your code
} catch {
    TechMonitor.reportError(error)
    throw error
}`,
      details: t.details.swift,
    },
    {
      value: "java",
      label: t.tabs.java,
      code: `// TechMonitor Error Reporter - Java
// Add dependency: com.google.code.gson:gson:2.10.1

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.Instant;
import java.io.PrintWriter;
import java.io.StringWriter;

public class TechMonitor {
    private static final String API_KEY = "${project.apiKey}";
    private static final String INGEST_URL = "${ingestUrl}";
    private static final Gson gson = new Gson();

    public static void reportError(Throwable error) {
        reportError(error, "error");
    }

    public static void reportError(Throwable error, String level) {
        new Thread(() -> {
            try {
                JsonObject payload = new JsonObject();
                payload.addProperty("apiKey", API_KEY);
                payload.addProperty("message", error.getMessage());
                payload.addProperty("level", level);
                payload.addProperty("stackTrace", getStackTrace(error));
                
                JsonObject deviceInfo = new JsonObject();
                deviceInfo.addProperty("model", System.getProperty("os.name"));
                deviceInfo.addProperty("os", System.getProperty("os.version"));
                payload.add("deviceInfo", deviceInfo);
                
                payload.addProperty("occurredAt", Instant.now().toString());

                URL url = new URL(INGEST_URL);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(gson.toJson(payload).getBytes());
                }
                
                int status = conn.getResponseCode();
                System.out.println("Error reported: " + (status == 200));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private static String getStackTrace(Throwable t) {
        StringWriter sw = new StringWriter();
        t.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }
}

// Usage
try {
    // your code
} catch (Exception e) {
    TechMonitor.reportError(e);
    throw e;
}`,
      details: t.details.java,
    },
    {
      value: "curl",
      label: t.tabs.curl,
      code: `# TechMonitor Error Reporter - cURL
# Use this to test the integration or send errors from shell scripts

curl -X POST "${ingestUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "${project.apiKey}",
    "message": "Test error from shell script",
    "level": "error",
    "stackTrace": "at script.sh:15\\nat main.sh:42",
    "deviceInfo": {
      "model": "'$(hostname)'",
      "os": "'$(uname -s) $(uname -r)'"
    },
    "occurredAt": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'

# Response: {"success": true, "eventId": "..."}`,
      details: t.details.curl,
    },
  ];

  return (
    <div className="space-y-6 bg-gradient-to-b from-zinc-950 to-zinc-900 dark:to-zinc-950 rounded-xl p-4 md:p-6 border border-zinc-800/50 shadow-xl">
      <div className="flex flex-col gap-4 pb-4 border-b border-zinc-800/60">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          {t.title}
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/50">
            <span className="text-xs font-medium text-zinc-400">
              {t.apiKeyLabel}:
            </span>
            <code className="text-indigo-400 font-mono text-xs md:text-sm break-all">
              {project.apiKey}
            </code>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/50">
            <span className="text-xs font-medium text-zinc-400">
              {t.endpointLabel}:
            </span>
            <code className="text-emerald-400 font-mono text-xs md:text-sm break-all">
              {ingestUrl}
            </code>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-950/30 to-emerald-950/20 p-4 rounded-lg border border-indigo-800/40">
        <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          {t.tipTitle}
        </h4>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {t.tipText}
        </p>
      </div>

      <Tabs defaultValue="javascript" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex w-max gap-1 bg-zinc-900/50 p-1 rounded-lg">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-3 py-1.5 text-xs md:text-sm rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 transition-colors whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <div className="relative rounded-lg border border-zinc-700/60 bg-zinc-950/80">
              <div className="absolute right-2 top-2 z-10">
                <Button
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "h-8 px-2 text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300",
                    copiedTab === tab.value && "text-emerald-400"
                  )}
                  onClick={() => handleCopy(tab.value, tab.code)}
                >
                  {copiedTab === tab.value ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <Copy className="mr-1 h-3 w-3" />
                  )}
                  {copiedTab === tab.value ? t.copied : t.copy}
                </Button>
              </div>

              <ScrollArea className="max-h-[400px]">
                <pre className="p-4 pt-12 text-xs md:text-sm font-mono text-zinc-200 leading-relaxed">
                  <code>{tab.code.trim()}</code>
                </pre>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
              <h4 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                {t.featuresTitle}
              </h4>
              <ul className="space-y-2 text-zinc-300 text-sm">
                {tab.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="text-xs md:text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
