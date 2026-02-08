import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
    return c.html(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>🚀 Hello from VibeCode!</h1>
      <p>Your Hono server is running successfully.</p>
      <p>Edit <code>index.js</code> to get started.</p>
    </div>
  `);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port
});
