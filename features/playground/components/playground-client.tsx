"use client";

import React, { useState } from "react";
import { useWebContainer } from "@/features/webcontainers/hooks/useWebContainer";
import { WebContainerPreview } from "@/features/webcontainers/components/webcontainer-preveiw"; // Note: Keeping your spelling 'preveiw'
import TerminalComponent from "@/features/webcontainers/components/terminal";
import { PlaygroundEditor } from "./playground-editor";
import { TemplateFolder } from "../libs/path-to-json";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlaygroundClientProps {
  template: TemplateFolder;
}

export default function PlaygroundClient({ template }: PlaygroundClientProps) {
  // 1. CALL THE HOOK & GET THE SERVER URL
  const { instance, serverUrl, isLoading, writeFileSync } = useWebContainer({
    templateData: template,
  });

  const [activeTab, setActiveTab] = useState("preview");

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal">
        
        {/* LEFT PANEL: CODE EDITOR */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <PlaygroundEditor 
            files={template} 
            onFileChange={writeFileSync} 
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* RIGHT PANEL: PREVIEW & TERMINAL */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            
            {/* TOP RIGHT: PREVIEW WINDOW */}
            <ResizablePanel defaultSize={70} minSize={20} className="border-b">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b px-4 flex items-center justify-between bg-muted/40 h-10">
                  <TabsList className="h-8">
                    <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                    <TabsTrigger value="console" className="text-xs">Console</TabsTrigger>
                  </TabsList>
                  
                  {/* SHOW URL INDICATOR */}
                  {serverUrl && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {serverUrl}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. PASS THE URL TO THE PREVIEW COMPONENT */}
                <TabsContent value="preview" className="flex-1 m-0 p-0 relative h-full">
                  <WebContainerPreview url={serverUrl} isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="console" className="flex-1 m-0 p-4 h-full">
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Console output integration coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle />

            {/* BOTTOM RIGHT: TERMINAL */}
            <ResizablePanel defaultSize={30} minSize={10}>
              <div className="h-full w-full bg-[#09090B] overflow-hidden">
                <TerminalComponent 
                  webContainerInstance={instance} 
                  theme="dark"
                  className="h-full border-none rounded-none"
                />
              </div>
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}