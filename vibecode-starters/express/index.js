import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>VibeCode Express</title>
        <style>
          body {
            font-family: sans-serif;
            text-align: center;
            margin-top: 50px;
          }
          h1 { color: #333; }
          p { color: #666; }
          code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <h1>🚀 Hello from VibeCode Express!</h1>
        <p>Your Express server is running successfully on port ${PORT}</p>
        <p>Edit <code>index.js</code> to get started.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});