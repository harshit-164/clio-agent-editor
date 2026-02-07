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

    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const currentLine = useRef("");
    const commandHistory = useRef<string[]>([]);
    const historyIndex = useRef(-1);
    const currentProcess = useRef<any>(null);

    const writePrompt = useCallback(() => {
      term.current?.write("\r\n$ ");
      currentLine.current = "";
    }, []);

    useImperativeHandle(ref, () => ({
      writeToTerminal: (data: string) => term.current?.write(data),
      clearTerminal: () => {
        term.current?.clear();
        writePrompt();
      },
      focusTerminal: () => term.current?.focus(),
    }));

    const handleTerminalInput = useCallback(
      async (data: string) => {
        if (!term.current) return;

        if (data === "\r") {
          const command = currentLine.current.trim();
          commandHistory.current.push(command);
          historyIndex.current = commandHistory.current.length;
          term.current.writeln("");

          if (!command) {
            writePrompt();
            return;
          }

          if (command === "clear") {
            term.current.clear();
            writePrompt();
            return;
          }

          if (webContainerInstance) {
            try {
              const [cmd, ...args] = command.split(" ");
              const process = await webContainerInstance.spawn(cmd, args, {
                terminal: {
                  cols: term.current.cols,
                  rows: term.current.rows,
                },
              });

              currentProcess.current = process;

              process.output.pipeTo(
                new WritableStream({
                  write(chunk) {
                    term.current?.write(chunk);
                  },
                })
              );

              await process.exit;
            } catch {
              term.current.writeln("Command not found");
            }
          }

          writePrompt();
          return;
        }

        if (data === "\u007F") {
          if (currentLine.current.length > 0) {
            currentLine.current = currentLine.current.slice(0, -1);
            term.current.write("\b \b");
          }
          return;
        }

        currentLine.current += data;
        term.current.write(data);
      },
      [webContainerInstance, writePrompt]
    );

    const initializeTerminal = useCallback(() => {
      if (!terminalRef.current || term.current) return;

      (async () => {
        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");
        const { WebLinksAddon } = await import("xterm-addon-web-links");
        const { SearchAddon } = await import("xterm-addon-search");
        await import("xterm/css/xterm.css");

        const terminal = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          theme: terminalThemes[theme],
          scrollback: 1000,
        });

        const fit = new FitAddon();
        const search = new SearchAddon();

        terminal.loadAddon(fit);
        terminal.loadAddon(new WebLinksAddon());
        terminal.loadAddon(search);

        terminal.open(terminalRef.current!);
        fit.fit();

        terminal.onData(handleTerminalInput);

        terminal.writeln("🚀 WebContainer Terminal");
        terminal.writeln("Type commands and press Enter");
        writePrompt();

        term.current = terminal;
        fitAddon.current = fit;
        searchAddon.current = search;

        setIsConnected(true);
      })();
    }, [handleTerminalInput, theme, writePrompt]);

    useEffect(() => {
      initializeTerminal();

      const observer = new ResizeObserver(() => {
        fitAddon.current?.fit();
      });

      if (terminalRef.current) observer.observe(terminalRef.current);

      return () => {
        observer.disconnect();
        term.current?.dispose();
        term.current = null;
      };
    }, [initializeTerminal]);

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
      a.href = url;
      a.download = "terminal-log.txt";
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className={cn("flex flex-col h-full border rounded-lg", className)}>
        <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">
            Terminal {isConnected && "●"}
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
          className="flex-1 p-2"
          style={{ background: terminalThemes[theme].background }}
        />
      </div>
    );
  }
);

TerminalComponent.displayName = "TerminalComponent";
export default TerminalComponent;
