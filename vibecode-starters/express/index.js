import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1>🚀 Hello from Vibe Code!</h1>
      <p>Your Express server is running successfully on port ${port}.</p>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});