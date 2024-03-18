import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../db/models/previous_models/user";
import message_constants from "../../public/message_constants";

export const authmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers as { authorization: string };

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const token: string = authorization.split(" ")[1];
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    const validUser = await User.findOne({
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
        error: message_constants.NF,
      });
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token", errormessage: message_constants.UA });
    } else {
      return res
        .status(500)
        .json({ message: "Server error", errormessage: message_constants.ISE });
    }
  }
};

export default authmiddleware;
