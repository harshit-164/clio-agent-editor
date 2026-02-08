import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/features/playground/libs/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

// Helper function to ensure valid JSON
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const id = param.id;

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  try {
    const playground = await db.playground.findUnique({
      where: { id },
    });

    if (!playground) {
      return Response.json({ error: "Playground not found" }, { status: 404 });
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
      console.error(`Template path not found for key: ${templateKey}`);
      return Response.json({ error: "Invalid template" }, { status: 404 });
    }

    // Ensure templatePath is a string
    if (typeof templatePath !== 'string') {
      console.error(`Template path is not a string:`, templatePath);
      return Response.json({ error: "Invalid template path configuration" }, { status: 500 });
    }

    const inputPath = path.join(process.cwd(), templatePath);
    const outputFile = path.join(process.cwd(), `output/${templateKey}.json`);

    console.log("Template Key:", templateKey);
    console.log("Template Path:", templatePath);
    console.log("Input Path:", inputPath);
    console.log("Output Path:", outputFile);

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    await fs.mkdir(outputDir, { recursive: true });

    // Save and read the template structure
    await saveTemplateStructureToJson(inputPath, outputFile);
    const result = await readTemplateStructureFromJson(outputFile);

    // Validate the JSON structure before returning
    if (!validateJsonStructure(result.items)) {
      return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
    }

    // Clean up the temporary file
    await fs.unlink(outputFile);

    return Response.json({ success: true, templateJson: result }, { status: 200 });
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json({ 
      error: "Failed to generate template",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


