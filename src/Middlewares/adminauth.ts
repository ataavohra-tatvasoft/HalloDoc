import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../Models/admin';

export const adminauthmiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers as { authorization: string };

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const token:string = authorization.split(" ")[1];
    const verifiedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    const validUser  = await Admin.findOne({
      where: {
        email: verifiedToken.email,
      },
    });

    if (validUser) {
      (req as any).email = verifiedToken.email;
      next();
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid user",
      });
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Server error" });
    }
  }
};

export default adminauthmiddleware;
