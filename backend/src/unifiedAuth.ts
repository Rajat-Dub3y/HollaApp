import type { Request, Response, NextFunction } from "express";

// Unified authentication middleware that checks multiple auth methods
// Prioritizes Firebase auth, then standalone auth to avoid OAuth permission dialogs
export const unifiedAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check Firebase authentication first (highest priority)
  if ((req.session as any)?.firebaseUser) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).firebaseUser.uid,
        email: (req.session as any).firebaseUser.email,
        name: (req.session as any).firebaseUser.name
      } 
    };
    return next();
  }

  // Check standalone authentication second (no OAuth permissions)
  if ((req.session as any)?.standaloneUserId) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).standaloneUserId 
      } 
    };
    return next();
  }

  // Check direct authentication (minimal permissions)
  if ((req.session as any)?.directUserId) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).directUserId 
      } 
    };
    return next();
  }

  // For routes that require authentication, return 401
  return res.status(401).json({ message: "Authentication required" });
};

// Optional authentication - doesn't require login but provides user if available
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check Firebase authentication first (highest priority)
  if ((req.session as any)?.firebaseUser) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).firebaseUser.uid,
        email: (req.session as any).firebaseUser.email,
        name: (req.session as any).firebaseUser.name
      } 
    };
  }
  // Check standalone authentication second
  else if ((req.session as any)?.standaloneUserId) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).standaloneUserId 
      } 
    };
  }
  // Check direct authentication
  else if ((req.session as any)?.directUserId) {
    (req as any).user = { 
      claims: { 
        sub: (req.session as any).directUserId 
      } 
    };
  }
  // Check OAuth as fallback (but don't require it)
  else if (req.isAuthenticated && req.isAuthenticated()) {
    // User is already authenticated via OAuth
  }

  // Always proceed regardless of auth status
  next();
};