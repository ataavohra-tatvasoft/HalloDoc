import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import statusCodes from "../../public/status_codes";
import { Request, Response, NextFunction } from "express";
import Provider from "../../db/models/admin";

import dotenv from "dotenv";
dotenv.config();

export const provider_login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email, password },
    } = req;
    var providerdata;
    const hash = await Provider.findOne({
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
      providerdata = await Provider.findOne({
        where: {
          email,
          password: hashpassword,
        },
      });
    }

    if (!providerdata) {
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
