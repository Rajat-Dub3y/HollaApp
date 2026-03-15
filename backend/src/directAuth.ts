import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage.ts";

// Direct authentication without OAuth
export function setupDirectAuth(app: Express) {

  // Direct login without permissions
  app.post('/api/direct-login', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email required" });
      }

      const userId = `direct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = await storage.upsertUser({
        id: userId,
        email: email,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
      });

      (req.session as any).directUserId = user.id;
      (req.session as any).directUser = user;

      res.json({ success: true, user });
    } catch (error) {
      console.error("Direct login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Check direct auth status
  app.get('/api/direct-auth/user', (req: Request, res: Response) => {
    const directUser = (req.session as any)?.directUser;
    if (!directUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(directUser);
  });
}

// Direct auth middleware
export const isDirectAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const directUserId = (req.session as any)?.directUserId;
  
  if (!directUserId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  (req as any).user = { claims: { sub: directUserId } };
  next();
};