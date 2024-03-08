import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import statusCodes from "../../public/status_codes";
import { Request, Response, NextFunction } from "express";
import User from "../../db/models/previous_models/user";
import dotenv from "dotenv";
dotenv.config();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var user_data;
    const {
      body: { email, password },
    } = req;
    const user = await User.findOne({
      attributes:[
        "user_id",
        "password",
        "firstname",
        "lastname",
        "email",
        "type_of_user"
      ],
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "USER " + statusCodes[404],
      });
    }
    if (user) {
      const hashpassword = user.password;
      const user_boolean = await bcrypt.compare(password, hashpassword);
      if (user_boolean) {
        user_data = await User.findOne({
          where: {
            email,
            password: hashpassword,
          },
          attributes:[
            "user_id",
            "firstname",
            "lastname",
            "email",
            "type_of_user"
          ]
        }
        );
      }
      if (!user_data) {
        return res.status(401).json({
          status: false,
          message: statusCodes[401],
        });
      }
    }
    const data = {
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      type_of_user: user.type_of_user,
    };
    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY as string);

    return res.status(200).json({
      status: true,
      message: statusCodes[200],
      jwtToken,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: error.message,
      message: statusCodes[500],
    });
  }
};
