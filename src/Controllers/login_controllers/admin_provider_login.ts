import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import statusCodes from "../../public/status_codes";
import { Request, Response, NextFunction } from "express";
import Admin from "../../db/models/admin";
import Provider from "../../db/models/provider";

import dotenv from "dotenv";
import Patient from "../../db/models/patient";
dotenv.config();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var admin_data;
    var provider_data;
    const {
      body: { email, password },
    } = req;
    const admin_hash = await Admin.findOne({
      where: {
        email,
      },
    });
    const provider_hash = await Provider.findOne({
      where: {
        email,
      },
    });
    if (!admin_hash && !provider_hash) {
      return res.status(404).json({
        status: false,
        message: "USER " + statusCodes[404],
      });
    }
    if (admin_hash) {
      const hashpassword = admin_hash.password;
      const admin_boolean = await bcrypt.compare(password, hashpassword);
      if (admin_boolean) {
        admin_data = await Admin.findOne({
          where: {
            email,
            password: hashpassword,
          },
        });
      }
      if (!admin_data) {
        return res.status(401).json({
          status: false,
          message: statusCodes[401],
        });
      }
    }
    if (provider_hash) {
      const hashpassword = provider_hash.password;
      const provider_boolean = await bcrypt.compare(password, hashpassword);
      if (provider_boolean) {
        provider_data = await Patient.findOne({
          where: {
            email,
            password: hashpassword,
          },
        });
      }
      if (!provider_data) {
        return res.status(401).json({
          status: false,
          message: statusCodes[401],
        });
      }
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
