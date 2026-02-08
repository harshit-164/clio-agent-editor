// lib/template.ts
export const templateConfig = {
  REACT: {
    title: "React",
    description: "A JavaScript library for building user interfaces with component-based architecture",
    template: "REACT",
    folder: "react-ts",
    icon: "/react.svg",
  },
  EXPRESS: {
    title: "Express",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    template: "EXPRESS",
    folder: "express",
    icon: "/expressjs-icon.svg",
  },
  VUE: {
    title: "Vue",
    description: "The Progressive JavaScript Framework for building user interfaces",
    template: "VUE",
    folder: "vue",
    icon: "/vuejs-icon.svg",
  },
  ANGULAR: {
    title: "Angular",
    description: "The modern web developer's platform",
    template: "ANGULAR",
    folder: "angular", 
    icon: "/angular.svg",
  },
  NEXTJS: {
    title: "Next.js",
    description: "The React Framework for the Web",
    template: "NEXTJS",
    folder: "nextjs",
    icon: "/nextjs-icon.svg",
  },
  HONO: {
    title: "Hono",
    description: "Ultrafast web framework for the Edges",
    template: "HONO",
    folder: "hono",
    icon: "/hono.svg",
  }
} as const;

// Simple path mapping for API routes
export const templatePaths: Record<string, string> = {
  REACT: "vibecode-starters/react-ts",
  EXPRESS: "vibecode-starters/express",
  VUE: "vibecode-starters/vue",
  ANGULAR: "vibecode-starters/angular",
  NEXTJS: "vibecode-starters/nextjs",
  HONO: "vibecode-starters/hono",
};