import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import statusCodes from "../../public/status_codes";
import { Request, Response, NextFunction } from "express";
import Patient from "../../db/models/patient";

import dotenv from "dotenv";
dotenv.config();

export const patient_login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email, password },
    } = req;
    var patientdata;
    const hash = await Patient.findOne({
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
      patientdata = await Patient.findOne({
        where: {
          email,
          password: hashpassword,
        },
      });
    }

    if (!patientdata) {
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
