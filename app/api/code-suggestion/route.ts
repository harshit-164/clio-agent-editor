import { type NextRequest, NextResponse } from "next/server";

interface CodeSuggestionRequest {
  fileContent: string;
  cursorLine: number;
  cursorColumn: number;
  suggestionType: string;
  fileName?: string;
}

interface CodeContext {
  language: string;
  framework: string;
  beforeContext: string;
  currentLine: string;
  afterContext: string;
  cursorPosition: { line: number; column: number };
  isInFunction: boolean;
  isInClass: boolean;
  isAfterComment: boolean;
  incompletePatterns: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CodeSuggestionRequest = await request.json();
    const { fileContent, cursorLine, cursorColumn, suggestionType, fileName } = body;

    if (!fileContent || cursorLine < 0 || cursorColumn < 0 || !suggestionType) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const context = analyzeCodeContext(fileContent, cursorLine, cursorColumn, fileName);
    const prompt = buildPrompt(context, suggestionType);
    const suggestion = await generateSuggestion(prompt);

    return NextResponse.json({
      suggestion,
      context,
      metadata: {
        language: context.language,
        framework: context.framework,
        position: context.cursorPosition,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Context analysis error:", error);
    return NextResponse.json({ error: "Internal error", message: error.message }, { status: 500 });
  }
}

function analyzeCodeContext(content: string, line: number, column: number, fileName?: string): CodeContext {
  const lines = content.split("\n");
  const currentLine = lines[line] || "";
  const contextRadius = 10;
  const startLine = Math.max(0, line - contextRadius);
  const endLine = Math.min(lines.length, line + contextRadius);

  return {
    language: detectLanguage(content, fileName),
    framework: detectFramework(content),
    beforeContext: lines.slice(startLine, line).join("\n"),
    currentLine,
    afterContext: lines.slice(line + 1, endLine).join("\n"),
    cursorPosition: { line, column },
    isInFunction: detectInFunction(lines, line),
    isInClass: detectInClass(lines, line),
    isAfterComment: detectAfterComment(currentLine, column),
    incompletePatterns: detectIncompletePatterns(currentLine, column),
  };
}

function buildPrompt(context: CodeContext, suggestionType: string): string {
  return `You are an expert code completion assistant.
Generate only the code snippet that should be inserted exactly at the |CURSOR| marker.

Language: ${context.language}
Framework: ${context.framework}

Context:
${context.beforeContext}
${context.currentLine.substring(0, context.cursorPosition.column)}|CURSOR|${context.currentLine.substring(context.cursorPosition.column)}
${context.afterContext}

Instructions:
1. Provide ONLY the code.
2. No explanations, no markdown backticks, no comments.
3. Match the existing indentation.`;
}

async function generateSuggestion(prompt: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5-coder:1.5b",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.2,
          top_p: 0.9,
          num_predict: 300,
        },
      }),
    });

    if (!response.ok) {
      console.warn("Ollama connection failed - AI suggestions disabled");
      return "// AI suggestions require Ollama running on localhost:11434\n// Install: https://ollama.ai\n// Run: ollama run qwen2.5-coder:1.5b";
    }

    const data = await response.json();
    let suggestion = data.response;

    // Remove markdown code blocks if the AI accidentally included them
    suggestion = suggestion.replace(/```[\w]*\n?|```/g, "").trim();
    // Remove the cursor marker if the AI repeated it
    suggestion = suggestion.replace(/\|CURSOR\|/g, "").trim();

    return suggestion || "// No suggestion";
  } catch (error) {
    console.warn("Ollama not available - AI suggestions disabled:", error);
    return "// AI suggestions require Ollama\n// Install from https://ollama.ai\n// Then run: ollama run qwen2.5-coder:1.5b";
  }
}

// Helper functions
function detectLanguage(content: string, fileName?: string): string {
  if (fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const extMap: Record<string, string> = {
      ts: "TypeScript", tsx: "TypeScript", js: "JavaScript", jsx: "JavaScript",
      py: "Python", java: "Java", go: "Go", rs: "Rust", php: "PHP",
    };
    if (ext && extMap[ext]) return extMap[ext];
  }
  return content.includes("interface ") ? "TypeScript" : "JavaScript";
}

function detectFramework(content: string): string {
  if (content.includes("import React") || content.includes("useState")) return "React";
  if (content.includes("next/")) return "Next.js";
  return "None";
}

function detectInFunction(lines: string[], currentLine: number): boolean {
  for (let i = currentLine - 1; i >= 0; i--) {
    if (lines[i]?.match(/^\s*(function|def|const\s+\w+\s*=|let\s+\w+\s*=)/)) return true;
    if (lines[i]?.match(/^\s*}/)) break;
  }
  return false;
}

function detectInClass(lines: string[], currentLine: number): boolean {
  for (let i = currentLine - 1; i >= 0; i--) {
    if (lines[i]?.match(/^\s*(class|interface)\s+/)) return true;
  }
  return false;
}

function detectAfterComment(line: string, column: number): boolean {
  return /\/\/.*$/.test(line.substring(0, column));
}

function detectIncompletePatterns(line: string, column: number): string[] {
  const before = line.substring(0, column).trim();
  const patterns: string[] = [];
  if (before.endsWith("(")) patterns.push("params");
  if (before.endsWith("{")) patterns.push("block");
  return patterns;
}