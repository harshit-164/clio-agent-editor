"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/features/playground/types";
import Terminal from "./terminal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatePreviews } from "@/features/playground/utils/fakeLogs";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  instance: WebContainer | null;
  writeFileSync: ((path: string, content: string) => Promise<void>) | undefined;
  isLoading: boolean;
  error: string | null;
  serverUrl: string | null;
  forceResetup?: boolean;
  templateType?: string;
  isEdited?: boolean;
}

const WebContainerPreview = ({
  templateData,
  instance,
  writeFileSync,
  isLoading,
  error,
  serverUrl,
  forceResetup = false,
  templateType = "react",
  isEdited = false,
}: WebContainerPreviewProps) => {
  const [activeTab, setActiveTab] = useState<"preview" | "terminal">("preview");

  // Auto-switch to terminal when server is not ready only if we don't have a fake preview
  // Actually user wants preview to be available immediately as "Dummy"

  useEffect(() => {
    // If real server is ready, switch to preview
    if (serverUrl) {
      setActiveTab("preview");
    }
  }, [serverUrl]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Booting WebContainer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <div className="text-center p-4">
          <p className="font-medium text-destructive">WebContainer Error</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <div className="text-center p-4">
          <p className="font-medium">WebContainer not initialized</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while the container boots...
          </p>
        </div>
      </div>
    );
  }

  // Determine what to show in preview
  // 1. Real Server URL (Best)
  // 2. Dummy Preview (If not edited yet and no server url)
  // 3. Loading State (If edited or waiting for server)

  const showDummy = !serverUrl && !isEdited;
  const dummyContent = TemplatePreviews[templateType.toLowerCase()] || TemplatePreviews['react'];

  return (
    <div className="h-full w-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "terminal")} className="h-full flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-10">
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
          <TabsTrigger value="terminal" className="flex-1">
            Terminal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 m-0 p-0 relative">
          {serverUrl ? (
            <div className="h-full w-full bg-white">
              <iframe
                src={serverUrl}
                className="w-full h-full border-none bg-white"
                title="Preview"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            </div>
          ) : showDummy ? (
            <div className="h-full w-full bg-white relative">
              {/* Fake Preview Iframe */}
              <iframe
                srcDoc={dummyContent}
                className="w-full h-full border-none bg-white"
                title="Dummy Preview"
              />
              <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm pointer-events-none">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Starting Dev Server...</span>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-background/50">
              <div className="text-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="font-medium">Server starting...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Running npm install && npm run dev
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Check the Terminal tab for progress
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="terminal" className="flex-1 m-0 p-2">
          <Terminal
            webContainerInstance={instance}
            theme="dark"
            templateType={templateType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebContainerPreview;