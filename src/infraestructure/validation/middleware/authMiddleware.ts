import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PostgresAuthRepository } from '../../repositories/postgresAuthRepository';
import pool from '../../config/database';

interface JwtPayload {
  id: string;
  email: string;
}

const authRepository = new PostgresAuthRepository(pool);

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        message: 'No token provided',
        status: 'ERROR'
      });
      return;
    }

    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    authRepository.findById(decoded.id).then(user => {
      if (!user) {
        res.status(401).json({ 
          message: 'Invalid token',
          status: 'ERROR'
        });
        return;
      }
      req.user = user;
      next();
    }).catch(() => {
      res.status(401).json({ 
        message: 'Invalid token',
        status: 'ERROR'
      });
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid token',
      status: 'ERROR'
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  
  if (!user) {
    res.status(401).json({ 
      message: 'Authentication required',
      status: 'ERROR'
    });
    return;
  }

  if (user.getRole() !== 'admin') {
    res.status(403).json({ 
      message: 'Access denied. Admin role required',
      status: 'ERROR'
    });
    return;
  }

  next();
}; 