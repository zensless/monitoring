import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f62c02e5/health", (c) => {
  return c.json({ status: "ok" });
});

// This endpoint is no longer used - chat functionality moved to frontend
app.post("/make-server-f62c02e5/chat", async (c) => {
  return c.json({ 
    error: "This endpoint is deprecated. Chat functionality has been moved to the frontend." 
  }, 410);
});

Deno.serve(app.fetch);
