"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface WebContainerPreviewProps {
  url: string | null;
  isLoading?: boolean;
}

export const WebContainerPreview = ({ url, isLoading }: WebContainerPreviewProps) => {
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Booting server...</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <div className="text-center p-4">
          <p className="font-medium">Server not ready</p>
          <p className="text-sm text-muted-foreground mt-1">
            The terminal is running 'npm install'. Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <iframe
        src={url}
        className="w-full h-full border-none bg-white"
        title="Preview"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default WebContainerPreview;