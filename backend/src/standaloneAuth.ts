import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage.ts";
import type { User } from "./schema.ts"; // Ensure this import points to your schema

export function setupStandaloneAuth(app: Express) {
  app.post("/api/standalone-login", async (req: Request, res: Response) => {
    console.log("standalone login request received");
    try {
      const { email } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email required" });
      }

      // 1. Check if user already exists
      // storage.getUserByEmail returns an Array (User[])
      const existingUsers = await storage.getUserByEmail(email);
      let user: User | undefined;

      if (existingUsers && existingUsers.length > 0) {
        // Unwrap the array: take the first user found
        user = existingUsers[0];
        console.log("Existing user found:", user.id);
      } else {
        // 2. Create new user if not found
        // upsertUser also returns an Array because of .returning()
        const newUser = await storage.upsertUser({
          id: `standalone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          firstName: null,
          lastName: null,
          profileImageUrl: null,
          welcomeEmailSent: false,
        });

        // If your storage.ts doesn't unwrap the array internally, do it here:
        user = Array.isArray(newUser) ? newUser[0] : newUser;
        console.log("New user created:", user?.id);
      }

      if (!user) {
        throw new Error("Failed to retrieve or create user");
      }

      // 3. Set session markers - user.id will now work because 'user' is an object, not an array
      (req.session as any).standaloneUserId = user.id;
      (req.session as any).standaloneUser = user;

      res.json({ success: true, user });
    } catch (error) {
      console.error("Standalone login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Check standalone auth status
  app.get("/api/standalone-auth/user", (req: Request, res: Response) => {
    const standaloneUser = (req.session as any)?.standaloneUser;
    if (!standaloneUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(standaloneUser);
  });

  // Logout
  app.post("/api/standalone-logout", (req: Request, res: Response) => {
    delete (req.session as any).standaloneUserId;
    delete (req.session as any).standaloneUser;
    res.json({ success: true });
  });
}