import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import { verified_token } from "../../interfaces/common_interface";
import Role from "../../db/models/role";
import { where } from "sequelize";
import Access from "../../db/models/access";

export const role_access_middleware = async (
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
    ) as verified_token;

    const role_id = verified_token.role_id;

    const role = await Role.findOne({
      where: {
        role_id,
      },
      include: [
        {
          model: Access,
        },
      ],
    });
    if (!role) {
      return res.status(404).json({
        message: message_constants.RoNF,
      });
    }
    for (const access of role.Access) {
      //  if(access = ){
      //      next();
      //  }
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token", errormessage: message_constants.UA });
    } else {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Server error", errormessage: message_constants.ISE });
    }
  }
};

export default role_access_middleware;
