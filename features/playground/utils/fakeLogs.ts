export const getTemplateLogs = (template: string) => {
    const commonLogs = [
        "> vibecode-app@0.0.0 dev /home/vibecode/app",
        "> vite",
        "",
        "  VITE v5.0.0  ready in 350 ms",
        "",
        "  ➜  Local:   http://localhost:3000/",
        "  ➜  Network: use --host to expose",
        "  ➜  press h + enter to show help",
    ];

    const installLogs = [
        "added 1 package, and audited 2 packages in 3s",
        "found 0 vulnerabilities",
        "npm notice",
        "npm notice New major version of npm available! 10.2.3 -> 10.8.2",
        "npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.8.2",
        "npm notice Run npm install -g npm@10.8.2 to update!",
        "npm notice",
    ];

    const frameworks: Record<string, string[]> = {
        "react": [
            "Downloading react@18.2.0...",
            "Downloading react-dom@18.2.0...",
            "Downloading @vitejs/plugin-react@4.2.0...",
            "Downloading vite@5.0.0...",
            "Downloading autoprefixer@10.4.16...",
            "Downloading postcss@8.4.31...",
            "Downloading tailwindcss@3.3.5...",
            "Downloading eslint@8.53.0...",
            "Downloading eslint-plugin-react@7.33.2...",
            "Downloading eslint-plugin-react-hooks@4.6.0...",
            "Downloading eslint-plugin-react-refresh@0.4.4...",
            "Downloading scheduler@0.23.0...",
            "Downloading loose-envify@1.4.0...",
            "Downloading js-tokens@4.0.0...",
            "Downloading picocolors@1.0.0...",
            "Downloading source-map-js@1.0.2...",
            "Downloading vite-plugin-inspect@0.7.38...",
            "Downloading rollup@3.29.4...",
            "Downloading @esbuild/linux-x64@0.19.5...",
            "Downloading @rollup/plugin-node-resolve@15.2.3...",
        ],
        "vue": [
            "Downloading vue@3.3.8...",
            "Downloading @vitejs/plugin-vue@4.5.0...",
            "Downloading vite@5.0.0...",
            "Downloading @vue/compiler-sfc@3.3.8...",
            "Downloading @vue/reactivity@3.3.8...",
            "Downloading @vue/runtime-core@3.3.8...",
            "Downloading @vue/runtime-dom@3.3.8...",
            "Downloading @vue/shared@3.3.8...",
            "Downloading estree-walker@2.0.2...",
            "Downloading magic-string@0.30.5...",
            "Downloading postcss@8.4.31...",
            "Downloading source-map@0.6.1...",
            "Downloading @babel/parser@7.23.3...",
            "Downloading @vue/devtools-api@6.5.1...",
        ],
        "angular": [
            "Downloading @angular/core@17.0.0...",
            "Downloading @angular/cli@17.0.0...",
            "Downloading @angular/common@17.0.0...",
            "Downloading @angular/compiler@17.0.0...",
            "Downloading @angular/platform-browser@17.0.0...",
            "Downloading @angular/platform-browser-dynamic@17.0.0...",
            "Downloading rxjs@7.8.1...",
            "Downloading tslib@2.6.2...",
            "Downloading zone.js@0.14.2...",
            "Downloading @angular-devkit/build-angular@17.0.0...",
            "Downloading typescript@5.2.2...",
        ],
        "express": [
            "Downloading express@4.18.2...",
            "Downloading nodemon@3.0.1...",
            "Downloading body-parser@1.20.2...",
            "Downloading cookie-parser@1.4.6...",
            "Downloading debug@4.3.4...",
            "Downloading depd@2.0.0...",
            "Downloading encodeurl@1.0.2...",
            "Downloading escape-html@1.0.3...",
            "Downloading etag@1.8.1...",
            "Downloading finalhandler@1.2.0...",
            "Downloading fresh@0.5.2...",
            "Downloading http-errors@2.0.0...",
            "Downloading merge-descriptors@1.0.1...",
            "Downloading methods@1.1.2...",
            "Downloading on-finished@2.4.1...",
            "Downloading parseurl@1.3.3...",
            "Downloading path-to-regexp@0.1.7...",
        ],
        "node": [
            "Downloading express@4.18.2...",
            "Downloading nodemon@3.0.1...",
            "Downloading dotenv@16.3.1...",
            "Downloading cors@2.8.5...",
        ],
        "nextjs": [
            "Downloading next@14.0.2...",
            "Downloading react@18.2.0...",
            "Downloading react-dom@18.2.0...",
            "Downloading eslint-config-next@14.0.2...",
            "Downloading typescript@5.2.2...",
            "Downloading @types/node@20.9.0...",
            "Downloading @types/react@18.2.37...",
            "Downloading @types/react-dom@18.2.15...",
            "Downloading postcss@8.4.31...",
            "Downloading tailwindcss@3.3.5...",
            "Downloading styled-jsx@5.1.0...",
            "Downloading client-only@0.0.1...",
            "Downloading busboy@1.6.0...",
            "Downloading caniuse-lite@1.0.30001561...",
        ],
        "hono": [
            "Downloading hono@3.10.0...",
            "Downloading @hono/node-server@1.2.0...",
            "Downloading esbuild@0.19.5...",
            "Downloading tsx@4.1.0...",
            "Downloading typescript@5.2.2...",
        ]
    };

    const specificLogs = frameworks[template.toLowerCase()] || frameworks['react'];

    // Create a large fake simulation log
    const fillerLogs = Array.from({ length: 50 }, (_, i) => `[${i + 1}/50] Resolving dependencies...`);

    return {
        install: [
            "npm install",
            ...fillerLogs,
            ...specificLogs.map(l => `[GET] registry.npmjs.org/${l.split(' ')[1]} ... 200 OK`),
            ...installLogs
        ],
        start: [
            "npm run dev",
            ...commonLogs
        ]
    };
};

export const TemplatePreviews: Record<string, string> = {
    "react": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #61dafb; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>⚛️ React Preview Ready</h1>
          <p>Your React environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
    "vue": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #42b883; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🟢 Vue Preview Ready</h1>
          <p>Your Vue environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
    "angular": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #dd0031; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🅰️ Angular Preview Ready</h1>
          <p>Your Angular environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
    "nextjs": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #000; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>▲ Next.js Preview Ready</h1>
          <p>Your Next.js environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
    "express": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚂 Express Preview Ready</h1>
          <p>Your Express environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
    "hono": `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; color: #333; }
          .card { padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); background: #f8f9fa; text-align: center; }
          h1 { color: #E05D44; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🔥 Hono Preview Ready</h1>
          <p>Your Hono environment is pre-loaded and ready.</p>
          <p>Edit any file to see changes live!</p>
        </div>
      </body>
    </html>
  `,
};
