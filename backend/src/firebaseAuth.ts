import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { Express, Request, Response, NextFunction } from "express";

// Initialize Firebase Admin SDK
let adminApp;
if (getApps().length === 0) {
  // In production, you would use a service account key file
  // For development, we'll use the default credentials or emulator
  adminApp = initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
} else {
  adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);

// Middleware to verify Firebase ID token and create session
export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const idToken = authHeader?.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : req.body.idToken;

  if (!idToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    (req as any).firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Setup Firebase auth routes
export function setupFirebaseAuth(app: Express) {
  // Firebase login - verify token and create session
  app.post("/api/auth/firebase-login", async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      // Store Firebase user info in session
      (req.session as any).firebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        emailVerified: decodedToken.email_verified,
        picture: decodedToken.picture,
      };

      // Also store in a compatible format for existing code
      (req.session as any).user = {
        claims: {
          sub: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
        }
      };

      console.log(`Firebase user logged in: ${decodedToken.email}`);
      
      res.json({ 
        success: true, 
        user: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
          emailVerified: decodedToken.email_verified,
        }
      });
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Firebase sync - for when Firebase auth state changes
  app.post("/api/auth/firebase-sync", async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      // Update session with latest Firebase user info
      (req.session as any).firebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        emailVerified: decodedToken.email_verified,
        picture: decodedToken.picture,
      };

      (req.session as any).user = {
        claims: {
          sub: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
        }
      };

      res.json({ success: true });
    } catch (error) {
      console.error("Error syncing Firebase token:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Get current Firebase user
  app.get("/api/auth/firebase-user", (req: Request, res: Response) => {
    const firebaseUser = (req.session as any)?.firebaseUser;
    
    if (firebaseUser) {
      res.json({ user: firebaseUser });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Logout - clear session
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
}

// Middleware to check if user is authenticated via Firebase
export const isFirebaseAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const firebaseUser = (req.session as any)?.firebaseUser;
  
  if (!firebaseUser) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  (req as any).user = {
    claims: {
      sub: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name,
    }
  };
  
  next();
};