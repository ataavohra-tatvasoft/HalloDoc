import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import message_constants from "../../constants/message_constants";
import { Controller, FormattedResponse, VerifiedToken } from "../../interfaces";
import { User } from "../../db/models";

/** Configs */
dotenv.config({ path: `.env` });

/**patient in My Profile */

/**
 * @description Retrieves and formats the profile data of an patient user.
 * @param {Request} req - The request object containing the authorization token.
 * @param {Response} res - The response object to send the patient profile data.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response containing the formatted patient profile data or an error message.
 */
export const patient_profile_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const patient_id = verified_token.user_id;
    const profile = await User.findOne({
      where: {
        user_id: patient_id,
      },
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }

    const formattedRequest = {
      patient_user_id: profile.user_id,
      general_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        date_of_birth: profile.dob.toISOString().split("T")[0],
      },
      contact_information: {
        type: "mobile",
        mobile_no: profile.mobile_no,
        email: profile.email,
      },
      location_information: {
        street: profile.street,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
      },
    };
    formatted_response.data.push(formattedRequest);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Handles the editing of patient profile information including personal details.
 * @param {Request} req - The request object containing the patient profile data to be updated.
 * @param {Response} res - The response object to send the status of the operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the profile update operation.
 */

export const patient_profile_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    console.log(verified_token);
    const patient_id = verified_token.user_id;
    const {
      type,
      firstname,
      lastname,
      date_of_birth,
      mobile_no,
      email,
      street,
      city,
      state,
      zip,
    } = req.body;

    const patient_profile = await User.findOne({
      where: {
        user_id: patient_id,
      },
    });

    if (!patient_profile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const update_profile_status = await User.update(
      {
        firstname,
        lastname,
        dob: new Date(date_of_birth),
        mobile_no: BigInt(mobile_no),
        email,
        street,
        city,
        state,
        zip: Number(zip),
      },
      {
        where: {
          user_id: patient_id,
        },
      }
    );

    if (!update_profile_status) {
      return res.status(500).json({ status: message_constants.EWU });
    }

    return res.status(200).json({ status: message_constants.US });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/** CREATE PATIENT ACCOUNT */

export const create_patient_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const patient_profile = await User.findOne({
      where: {
        email,
      },
    });

    if (patient_profile) {
      return res.status(404).json({ error: message_constants.PAC });
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const create_patient = await User.create({
      email,
      password: hashed_password,
      status: "active",
      type_of_user: "patient",
    });

    if (!create_patient) {
      return res.status(500).json({ status: message_constants.EWC });
    }

    return res.status(200).json({ status: message_constants.CS });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
