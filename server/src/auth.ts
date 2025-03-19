import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include the `user` property
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  const secret = process.env.SUPABASE_JWT_SECRET || "default_secret";

  try {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        res.sendStatus(403); 
        return;
      }

      req.user = user; 
      next();
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.sendStatus(500);
  }
}

export default authenticateToken;