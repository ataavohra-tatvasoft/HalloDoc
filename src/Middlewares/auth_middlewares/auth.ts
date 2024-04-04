import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import { verified_token } from "../../interfaces/common_interface";

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
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    )  as verified_token;
    const validUser = await User.findOne({
      where: {
        email: verified_token.email,
      },
    });

    if (validUser) {
      (req as any).email = verified_token.email;
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
