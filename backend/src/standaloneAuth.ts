import type { Express, Request, Response } from "express";
import { storage } from "./storage";

export function setupStandaloneAuth(app: Express) {
  app.post("/api/standalone-login", async (req: Request, res: Response) => {
    try {
      const { email, firebaseUid, idToken } = req.body;

      if (!firebaseUid || !email) {
        return res.status(400).json({ message: "firebaseUid and email required" });
      }

      // Optional: verify the token server-side for security
      // const decoded = await getAuth().verifyIdToken(idToken);
      // const firebaseUid = decoded.uid;

      // Look up by Firebase UID first
      let user = await storage.getUser(firebaseUid);

      if (!user) {
        // Check if they exist with old standalone ID (by email)
        const existingUsers = await storage.getUserByEmail(email);
        
        if (existingUsers && existingUsers.length > 0) {
          // Migrate: old standalone user found — you may want to update their ID
          // For now just use them, but ideally migrate to Firebase UID
          user = existingUsers[0];
          console.log("Found existing user by email:", user.id);
        } else {
          // Brand new user — create with Firebase UID
          const newUser = await storage.upsertUser({
            id: firebaseUid,  // ✅ Firebase UID as primary key
            email: email,
            firstName: null,
            lastName: null,
            profileImageUrl: null,
            welcomeEmailSent: false,
            subscriptionStatus: 'free',
          });
          user = Array.isArray(newUser) ? newUser[0] : newUser;
          console.log("New user created with Firebase UID:", user?.id);
        }
      }

      if (!user) throw new Error("Failed to retrieve or create user");

      (req.session as any).standaloneUserId = user.id;
      (req.session as any).standaloneUser = user;

      res.json({ success: true, user });
    } catch (error) {
      console.error("Standalone login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/standalone-auth/user", (req: Request, res: Response) => {
    const standaloneUserId = (req.session as any)?.standaloneUserId;
    if (!standaloneUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    storage.getUser(standaloneUserId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        (req.session as any).standaloneUser = user;
        res.json(user);
      })
      .catch((error) => {
        console.error("Standalone auth lookup error:", error);
        res.status(500).json({ message: "Failed to load user" });
      });
  });

  app.post("/api/standalone-logout", (req: Request, res: Response) => {
    delete (req.session as any).standaloneUserId;
    delete (req.session as any).standaloneUser;
    res.json({ success: true });
  });
}
