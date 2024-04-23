import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user";
import Region from "../../db/models/region";
import {
  Controller,
  FormattedResponse,
  VerifiedToken,
} from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import Role from "../../db/models/role";
import Documents from "../../db/models/documents";
import nodemailer from "nodemailer";
import Logs from "../../db/models/log";
// import UserRegionMapping from "../../db/models/user-region_mapping";

/** Configs */
dotenv.config({ path: `.env` });

/**Admin in My Profile */

/**
 * @description sent request to admin for provider/physician information change.
 * @param {Request} req - The request object containing the authorization token.
 * @param {Response} res - The response object to send the provider/physician profile data.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response containing the formatted provider/physician profile data or an error message.
 */
export const provider_request_to_admin: Controller = async (
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
    const provider_id = verified_token.user_id;
    const { message } = req.body;

    const profile = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const admins = await User.findAll({
      where: {
        type_of_user: "admin",
      },
    });

    if (!admins) {
      return res.status(404).json({ message: message_constants.ANF });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      debug: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Transporter-->", transporter);

    for (const admin of admins) {

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: "Request to change physician information",
        text: message,
      });

      if (!info) {
        return res.status(500).json({
          message: message_constants.EWSM,
        });
      }
      
      const email_log = await Logs.create({
        type_of_log: "Email",
        recipient: admin.firstname + " " + admin.lastname,
        action: "Request to change physician information",
        role_name: "Physician",
        email: admin.email,
        sent: "Yes",
      });

      if (!email_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const provider_request_to_admin_refactored: Controller = async (
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
    const provider_id = verified_token.user_id;
    const { message } = req.body;

    const profile = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const admins = await User.findAll({
      where: {
        type_of_user: "admin",
      },
    });

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: message_constants.ANF });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const admin of admins) {
      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: admin.email,
          subject: "Request to change physician information",
          text: message,
        });

        if (!info) {
          throw new Error("Error sending email");
        }

        const email_log = await Logs.create({
          type_of_log: "Email",
          recipient: admin.firstname + " " + admin.lastname,
          action: "Request to change physician information",
          role_name: "Physician",
          email: admin.email,
          sent: "Yes",
        });

        if (!email_log) {
          throw new Error("Error creating email log");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Retrieves and formats the profile data of an provider/physician user.
 * @param {Request} req - The request object containing the authorization token.
 * @param {Response} res - The response object to send the provider/physician profile data.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response containing the formatted provider/physician profile data or an error message.
 */
export const provider_profile_view: Controller = async (
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
    console.log(verified_token);
    const provider_id = verified_token.user_id;
    const profile = await User.findOne({
      where: {
        user_id: provider_id,
      },
      include: [
        {
          model: Region,
          attributes: ["region_id", "region_name"],
        },
        {
          model: Role,
          attributes: ["role_name"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }

    const documents = await Documents.findAll({
      where: {
        user_id: provider_id,
      },
    });

    if (!documents) {
      return res.status(404).json({
        message: message_constants.DNF,
      });
    }

    const formattedRequest = {
      admin_user_id: profile.user_id,
      provider_account_information: {
        username: "dummy",
      },
      physician_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        medical_licence: profile.medical_licence,
        NPI_number: profile.NPI_no,
        regions: profile.Regions?.map((region) => ({
          region_id: region.region_id,
          region_name: region.region_name,
        })),
      },
      mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no,
      },
      provider_profile: {
        business_name: profile.business_name,
        business_website: profile.business_website,
      },
      documents: {
        documents: documents.map((document) => ({
          documents_id: document.id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
    };
    formatted_response.data.push(formattedRequest);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Resets the password of an provider/physician user.
 * @param {Request} req - The request object containing the new password and admin ID.
 * @param {Response} res - The response object to send the status of the password reset operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the password reset operation.
 */
export const provider_profile_reset_password: Controller = async (
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
    const provider_id = verified_token.user_id;

    const {
      body: { password },
    } = req;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user_data = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });

    if (!user_data) {
      return res.status(200).json({ status: message_constants.UNF });
    }
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword },
        {
          where: {
            user_id: provider_id,
          },
        }
      );

      if (!updatePassword) {
        return res.status(200).json({ status: message_constants.EWU });
      }
      if (updatePassword) {
        return res.status(200).json({ status: message_constants.Success });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Handles the editing of provider/physician profile uploads.
 * @param {Request} req - The request object containing the admin profile data to be updated.
 * @param {Response} res - The response object to send the status of the operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the profile update operation.
 */

export const provider_provider_profile_upload: Controller = async (
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
    const provider_id = verified_token.user_id;

    const profile = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const uploaded_files: any = req.files || [];

    const profile_picture_path = uploaded_files.find(
      (file: any) => file.fieldname === "profile_picture"
    )?.path;
    const signature_photo_path = uploaded_files.find(
      (file: any) => file.fieldname === "signature_photo"
    )?.path;

    if (profile_picture_path || signature_photo_path) {
      const updated_user = await User.update(
        {
          profile_picture: profile_picture_path,
          signature_photo: signature_photo_path,
        },
        { where: { user_id: provider_id } }
      );
      console.log(updated_user);

      if (updated_user[0] === 1) {
        return res.status(200).json({ status: message_constants.US });
      } else {
        return res.status(500).json({ error: message_constants.EWU });
      }
    }

    return res.status(200).json({ status: message_constants.US });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
