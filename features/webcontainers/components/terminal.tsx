"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Trash2, Download, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplateLogs } from "@/features/playground/utils/fakeLogs";

interface TerminalProps {
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: any;
  templateType?: string;
}

export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
}

const terminalThemes = {
  dark: { background: "#09090B", foreground: "#FAFAFA", cursor: "#FAFAFA", selection: "#27272A" },
  light: { background: "#FFFFFF", foreground: "#18181B", cursor: "#18181B", selection: "#E4E4E7" },
};

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(
  ({ className, theme = "dark", webContainerInstance, templateType = "react" }, ref) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<any>(null);
    const fitAddon = useRef<any>(null);
    const searchAddon = useRef<any>(null);
    const shellProcess = useRef<any>(null);
    const fakeLogTimeouts = useRef<NodeJS.Timeout[]>([]);

    // Track if we have already run the start command
    const hasInitialized = useRef(false);
    const hasStartedFakeLogs = useRef(false);

    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => term.current?.write(data),
      clearTerminal: () => term.current?.clear(),
      focusTerminal: () => term.current?.focus(),
    }));

    // 1. Initialize UI
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
          convertEol: true,
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

        // terminal.writeln("Click to focus terminal...");
      };

      initTerminal();

      const handleResize = () => {
        fitAddon.current?.fit();
        if (shellProcess.current && term.current) {
          shellProcess.current.resize({ cols: term.current.cols, rows: term.current.rows });
        }
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        term.current?.dispose();
        term.current = null;
        fakeLogTimeouts.current.forEach(clearTimeout);
      };
    }, [theme]);

    const runFakeLogs = async () => {
      if (!term.current) return;

      // Clear existing timeouts
      fakeLogTimeouts.current.forEach(clearTimeout);
      fakeLogTimeouts.current = [];

      const logs = getTemplateLogs(templateType || "react");

      term.current.writeln("\x1b[33m\r\n> Booting container...\x1b[0m\r\n");

      let delay = 0;

      // Simulate install logs
      for (const line of logs.install) {
        const timeout = setTimeout(() => {
          term.current?.writeln(line);
        }, delay);
        fakeLogTimeouts.current.push(timeout);
        delay += Math.random() * 50 + 20;
      }

      delay += 800;

      // Simulate start logs
      for (const line of logs.start) {
        const timeout = setTimeout(() => {
          term.current?.writeln(line);
        }, delay);
        fakeLogTimeouts.current.push(timeout);
        delay += 200;
      }
    };

    // 2. Attach Shell & Auto-Run
    useEffect(() => {
      if (!term.current) return;

      // Start fake logs immediately if not started
      if (!hasStartedFakeLogs.current) {
        hasStartedFakeLogs.current = true;
        runFakeLogs();
      }

      if (!webContainerInstance || shellProcess.current) return;

      const startShell = async () => {
        try {
          // Don't clear terminal to keep fake logs visible

          const process = await webContainerInstance.spawn("jsh", {
            terminal: { cols: term.current.cols, rows: term.current.rows },
          });

          shellProcess.current = process;
          setIsConnected(true);

          const input = process.input.getWriter();
          process.output.pipeTo(
            new WritableStream({
              write(data) {
                // We can optionally filter out duplicate logs here if needed
                term.current.write(data);
              },
            })
          );

          term.current.onData((data: string) => { input.write(data); });

          // --- AUTO START REAL COMMAND SILENTLY ---
          if (!hasInitialized.current) {
            hasInitialized.current = true;
            // Wait a bit to align with fake logs 
            setTimeout(async () => {
              await input.write("npm install && npm run dev\r");
            }, 2000);
          }
          // ------------------------

          await process.exit;
          setIsConnected(false);
          shellProcess.current = null;
        } catch (error) {
          console.error("Shell error:", error);
        }
      };

      startShell();
    }, [webContainerInstance, templateType]);

    const manualStart = async () => {
      // Restart fake logs for visual feedback
      term.current?.clear();
      runFakeLogs();

      if (shellProcess.current && term.current) {
        console.log("Manual start triggered");
        const input = shellProcess.current.input.getWriter();
        await input.write("npm install && npm run dev\r");
        input.releaseLock();
      }
    };

    // Helpers
    const copyTerminalContent = async () => {
      const selection = term.current?.getSelection();
      if (selection) await navigator.clipboard.writeText(selection);
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
      a.href = url; a.download = "terminal-log.txt"; a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className={cn("flex flex-col h-full border rounded-lg", className)}>
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium flex items-center gap-2">
            Terminal {isConnected ? <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <span className="w-2 h-2 rounded-full bg-red-500" />}
          </span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={manualStart} title="Run Install & Dev"><Play className="h-3 w-3 text-green-500" /></Button>
            {showSearch && (
              <Input
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); searchAddon.current?.findNext(e.target.value); }}
                className="h-6 w-32 text-xs"
                placeholder="Search"
              />
            )}
            <Button size="sm" variant="ghost" onClick={() => setShowSearch(!showSearch)}><Search className="h-3 w-3" /></Button>
            <Button size="sm" variant="ghost" onClick={copyTerminalContent}><Copy className="h-3 w-3" /></Button>
            <Button size="sm" variant="ghost" onClick={downloadLog}><Download className="h-3 w-3" /></Button>
            <Button size="sm" variant="ghost" onClick={() => term.current?.clear()}><Trash2 className="h-3 w-3" /></Button>
          </div>
        </div>
        <div ref={terminalRef} className="flex-1 p-2 overflow-hidden" style={{ background: terminalThemes[theme].background }} />
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";
export default TerminalComponent;