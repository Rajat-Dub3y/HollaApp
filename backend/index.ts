import express from "express";
import type { Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { registerRoutes } from "./src/routes";
import cors from "cors";

const app = express();

const jsonParser = express.json();
const urlencodedParser = express.urlencoded({ extended: false });

app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    return next();
  }
  return jsonParser(req, res, next);
});
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    return next();
  }
  return urlencodedParser(req, res, next);
});

const MemoryStore = createMemoryStore(session);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://holla-app-nu.vercel.app",
      "https://www.holla-ai.com/"
    ],
    credentials: true,
  })
);

// Register API routes
registerRoutes(app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
