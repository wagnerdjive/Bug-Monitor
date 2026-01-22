import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

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
}

export function SdkInstructions({ project }: SdkInstructionsProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleCopy = (tab: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 1800);
  };

  const ingestUrl = `${window.location.origin}/api/ingest`;

  const tabs = [
    {
      value: "javascript",
      label: "JavaScript",
      code: `// Logra Error Reporter - JavaScript/TypeScript
const LOGRA_API_KEY = "${project.apiKey}";
const LOGRA_URL = "${ingestUrl}";

async function reportError(error) {
  try {
    const response = await fetch(LOGRA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: LOGRA_API_KEY,
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
    },
    {
      value: "python",
      label: "Python",
      code: `# Logra Error Reporter - Python
import requests
import traceback
import platform
from datetime import datetime

LOGRA_API_KEY = "${project.apiKey}"
LOGRA_URL = "${ingestUrl}"

def report_error(error, level="error"):
    """Report an error to Logra"""
    try:
        payload = {
            "apiKey": LOGRA_API_KEY,
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
            LOGRA_URL,
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
    },
    {
      value: "kotlin",
      label: "Kotlin",
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

object Logra {
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
    },
    {
      value: "swift",
      label: "Swift",
      code: `// TechMonitor Error Reporter - Swift/iOS
import Foundation
import UIKit

class Logra {
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
    },
    {
      value: "java",
      label: "Java",
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

public class Logra {
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
    },
    {
      value: "curl",
      label: "cURL",
      code: `# Logra Error Reporter - cURL
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
    },
  ];

  return (
    <div className="space-y-6 bg-gradient-to-b from-zinc-950 to-zinc-900 dark:to-zinc-950 rounded-xl p-4 md:p-6 border border-zinc-800/50 shadow-xl">
      <div className="flex flex-col gap-4 pb-4 border-b border-zinc-800/60">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          {t("sdk.title")}
        </h3>
        <p className="text-zinc-400 text-sm">{t("sdk.description")}</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/50">
            <span className="text-xs font-medium text-zinc-400">
              {t("sdk.apiKey")}:
            </span>
            <code className="text-indigo-400 font-mono text-xs md:text-sm break-all">
              {project.apiKey}
            </code>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-2 rounded-lg border border-zinc-700/50">
            <span className="text-xs font-medium text-zinc-400">
              Endpoint:
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
          {t("sdk.quickStart")}
        </h4>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {t("sdk.quickStartDesc")}
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
                  {copiedTab === tab.value ? t("common.copied") : t("common.copy")}
                </Button>
              </div>

              <ScrollArea className="max-h-[400px]">
                <pre className="p-4 pt-12 text-xs md:text-sm font-mono text-zinc-200 leading-relaxed">
                  <code>{tab.code.trim()}</code>
                </pre>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
