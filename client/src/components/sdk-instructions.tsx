import { Project } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SdkInstructionsProps {
  project: Project;
}

export function SdkInstructions({ project }: SdkInstructionsProps) {
  const [copied, setCopied] = useState(false);

  const snippet = `
// 1. Install the SDK
npm install @sentryclone/browser

// 2. Initialize in your app entry point
import * as SentryClone from "@sentryclone/browser";

SentryClone.init({
  apiKey: "${project.apiKey}",
  platform: "${project.platform}"
});
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium font-display">Integration Setup</h3>
        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
          API Key: {project.apiKey}
        </span>
      </div>
      
      <div className="relative group">
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 gap-2"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <pre className="code-block text-sm p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono overflow-x-auto">
          <code>{snippet.trim()}</code>
        </pre>
      </div>
    </div>
  );
}
