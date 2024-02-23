import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import statusCodes from "../public/statusCodes";
import { Request, Response, NextFunction } from "express";
import Admin from "../Models/admin";

import dotenv from "dotenv";
dotenv.config();

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email, password },
    } = req;
    var adminData;
    const hash = await Admin.findOne({
      where: {
        email,
      },
    });

    if (!hash) {
      return res.status(404).json({
        status: false,
        message: "USER " + statusCodes[404],
      });
    }

    const hashpassword = hash.password;
    const boolean = await bcrypt.compare(password, hashpassword);

    if (boolean) {
      adminData = await Admin.findOne({
        where: {
          email,
          password: hashpassword,
        },
      });
    }

    if (!adminData) {
      return res.status(401).json({
        status: false,
        message: statusCodes[401],
      });
    }

    const data = {
      email: email,
      password: password,
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
