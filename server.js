// server.js — Hostinger Node.js entry point
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Next.js is configured via frontend/next.config.ts with distDir: '../build'
// So at runtime, the build output is at <root>/build/
// We point Next.js at the frontend dir so it reads its config correctly,
// but the distDir resolves to the root build/ folder.
const app = next({
  dev,
  dir: path.join(__dirname, 'frontend'),
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, '0.0.0.0', () => {
      console.log(`> AgentTrust ready on http://0.0.0.0:${port}`);
      console.log(`> Environment: ${dev ? 'development' : 'production'}`);
      console.log(`> Build dir: ${path.join(__dirname, 'build')}`);
    });
});
