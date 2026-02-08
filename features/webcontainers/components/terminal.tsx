"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
  webcontainerUrl?: string;
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: any;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

const terminalThemes = {
  dark: {
    background: "#09090B",
    foreground: "#FAFAFA",
    cursor: "#FAFAFA",
    selection: "#27272A",
  },
  light: {
    background: "#FFFFFF",
    foreground: "#18181B",
    cursor: "#18181B",
    selection: "#E4E4E7",
  },
};

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  ({ className, theme = "dark", webContainerInstance }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<any>(null);
    const fitAddon = useRef<any>(null);
    const searchAddon = useRef<any>(null);
    const shellProcess = useRef<any>(null); // Track the shell process

    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => term.current?.write(data),
      clearTerminal: () => {
        term.current?.clear();
      },
      focusTerminal: () => term.current?.focus(),
    }));

    // 1. Initialize Terminal UI
    useEffect(() => {
      if (!terminalRef.current || term.current) return;

      const initTerminal = async () => {
        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");
        const { WebLinksAddon } = await import("xterm-addon-web-links");
        const { SearchAddon } = await import("xterm-addon-search");
        await import("xterm/css/xterm.css");

        const terminal = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          theme: terminalThemes[theme],
          scrollback: 1000,
          convertEol: true, // Help with line endings
        });

        const fit = new FitAddon();
        const search = new SearchAddon();

        terminal.loadAddon(fit);
        terminal.loadAddon(new WebLinksAddon());
        terminal.loadAddon(search);

        terminal.open(terminalRef.current!);
        fit.fit();

        term.current = terminal;
        fitAddon.current = fit;
        searchAddon.current = search;

        terminal.writeln("🚀 Starting WebContainer Shell...");
      };

      initTerminal();

      // Handle Resize
      const handleResize = () => {
        fitAddon.current?.fit();
        if (shellProcess.current && term.current) {
          shellProcess.current.resize({
            cols: term.current.cols,
            rows: term.current.rows,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        term.current?.dispose();
        term.current = null;
      };
    }, [theme]);

    // 2. Attach Shell when WebContainer is ready
    useEffect(() => {
      if (!term.current || !webContainerInstance) return;

      // Prevent spawning multiple shells for this component instance
      if (shellProcess.current) return;

      const startShell = async () => {
        try {
          // Clear initial loading message
          term.current.clear();
          
          // Spawn the system shell (jsh)
          const process = await webContainerInstance.spawn("jsh", {
            terminal: {
              cols: term.current.cols,
              rows: term.current.rows,
            },
          });

          shellProcess.current = process;
          setIsConnected(true);

          // Pipe process output to terminal
          process.output.pipeTo(
            new WritableStream({
              write(data) {
                term.current.write(data);
              },
            })
          );

          // Pipe terminal input to process
          const input = process.input.getWriter();
          term.current.onData((data: string) => {
            input.write(data);
          });

          await process.exit;
          setIsConnected(false);
          
        } catch (error) {
          console.error("Failed to start shell:", error);
          term.current.write("\r\n⚠️ Failed to start shell\r\n");
        }
      };

      startShell();
    }, [webContainerInstance]);

    // Utility Functions
    const copyTerminalContent = async () => {
      const selection = term.current?.getSelection();
      if (selection) {
        await navigator.clipboard.writeText(selection);
      }
    };

    const downloadLog = () => {
      if (!term.current) return;
      const buffer = term.current.buffer.active;
      let text = "";
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) text += line.translateToString(true) + "\n";
      }
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "terminal-log.txt";
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className={cn("flex flex-col h-full border rounded-lg", className)}>
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium flex items-center gap-2">
            Terminal {isConnected ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-red-500" />}
          </span>

          <div className="flex gap-1">
            {showSearch && (
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchAddon.current?.findNext(e.target.value);
                }}
                className="h-6 w-32 text-xs"
                placeholder="Search"
              />
            )}

            <Button size="sm" variant="ghost" onClick={() => setShowSearch(!showSearch)}>
              <Search className="h-3 w-3" />
            </Button>

            <Button size="sm" variant="ghost" onClick={copyTerminalContent}>
              <Copy className="h-3 w-3" />
            </Button>

            <Button size="sm" variant="ghost" onClick={downloadLog}>
              <Download className="h-3 w-3" />
            </Button>

            <Button size="sm" variant="ghost" onClick={() => term.current?.clear()}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div
          ref={terminalRef}
          className="flex-1 p-2 overflow-hidden"
          style={{ background: terminalThemes[theme].background }}
        />
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";
export default TerminalComponent;