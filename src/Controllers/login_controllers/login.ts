import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import message_constants from "../../public/message_constants";
import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user";
import { Controller } from "../../interfaces/common_interface";
import dotenv from "dotenv";
dotenv.config();

/**
 * @description Handles user login authentication.
 * @param {Request} req - The request object containing user email and password.
 * @param {Response} res - The response object to send the authentication result.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the authentication status and JWT token upon successful login.
 */
export const login: Controller = async (
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
        message: "USER " + message_constants.NF,
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
          message: message_constants.UA,
        });
      }
    }
    const data = {
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      type_of_user: user.type_of_user,
      role_id: user.role_id
    };
    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY as string);

    return res.status(200).json({
      status: true,
      message: message_constants.OK,
      jwtToken,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: error.message,
      message: message_constants.ISE,
    });
  }
};
