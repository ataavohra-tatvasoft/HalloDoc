import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import message_constants from "../../constants/message_constants";
import { User } from "../../db/models";
import { Controller } from "../../interfaces";
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
      attributes: [
        "user_id",
        "password",
        "firstname",
        "lastname",
        "email",
        "type_of_user",
        "role_id",
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
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "email",
            "type_of_user",
            "role_id",
          ],
        });
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
      role_id: user.role_id,
    };

    const jwt_token = jwt.sign(data, process.env.JWT_SECRET_KEY as string);

    return res.status(200).json({
      status: true,
      message: message_constants.OK,
      user_id: user.user_id,
      user: user.firstname + " " + user.lastname,
      type_of_user: user.type_of_user,
      jwt_token,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: error.message,
      message: message_constants.ISE,
    });
  }
};
