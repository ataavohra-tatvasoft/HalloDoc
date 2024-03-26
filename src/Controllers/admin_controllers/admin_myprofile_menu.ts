import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user";
import Region from "../../db/models/region";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";

/** Configs */
dotenv.config({ path: `.env` });

/**Admin in My Profile */

/**
 * @description Retrieves and formats the profile data of an admin user.
 * @param {Request} req - The request object containing the authorization token.
 * @param {Response} res - The response object to send the admin profile data.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response containing the formatted admin profile data or an error message.
 */
export const admin_profile_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const token: string = authorization.split(" ")[1];
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    console.log(verifiedToken);
    const admin_id = verifiedToken.user_id;
    const profile = await User.findOne({
      where: {
        user_id: admin_id,
      },
      attributes: [
        "user_id",
        // "username",
        "role",
        "status",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
        "district_of_columbia",
        "new_york",
        "virginia",
        "maryland",
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }

    const formattedRequest: any = {
      user_id: profile.user_id,
      account_information: {
        username: "dummy",
        status: profile.status,
        role: profile.role,
      },
      administrator_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        district_of_columbia: profile.district_of_columbia,
        new_york: profile.new_york,
        virginia: profile.virginia,
        maryland: profile.maryland,
      },
      mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no,
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Resets the password of an admin user.
 * @param {Request} req - The request object containing the new password and admin ID.
 * @param {Response} res - The response object to send the status of the password reset operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the password reset operation.
 */
export const admin_profile_reset_password: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { password, admin_id },
    } = req;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user_data = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (updatePassword) {
        res.status(200).json({ status: message_constants.Success });
      }
    }
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Handles the editing of admin profile information including personal and billing details.
 * @param {Request} req - The request object containing the admin profile data to be updated.
 * @param {Response} res - The response object to send the status of the operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the profile update operation.
 */
export const admin_profile_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_id } = req.body;
    const {
      firstname,
      lastname,
      email,
      mobile_no,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
    } = req.body;

    // Fetch the admin profile from the database
    const adminProfile = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });

    // If admin profile is not found, return error response
    if (!adminProfile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    let updateFields: any = {};

    // Check if personal information fields are provided and update the updateFields object
    if (firstname || lastname || email || mobile_no) {
      updateFields = {
        ...updateFields,
        firstname,
        lastname,
        email,
        mobile_no,
      };
    }

    // Check if mailing/billing information fields are provided and update the updateFields object
    if (address_1 || address_2 || city || state || zip || billing_mobile_no) {
      updateFields = {
        ...updateFields,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      };
    }

    // Update the admin profile with the provided fields
    const updateStatus = await User.update(updateFields, {
      where: {
        user_id: admin_id,
      },
    });

    // If the update operation is successful, return success response
    if (updateStatus) {
      res.status(200).json({ status: message_constants.US });
    }
  } catch (error) {
    // Handle any errors that occur during the update process and return internal server error response
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const admin_profile_admin_info_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstname,
      lastname,
      email,
      mobile_no,
      district_of_columbia,
      new_york,
      virginia,
      maryland,
      admin_id,
    } = req.body;
    // const { admin_id } = req.params;
    const adminprofile = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (!adminprofile) {
      return res.status(404).json({ error: message_constants.ANF });
    }
    const updatestatus = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
        district_of_columbia,
        new_york,
        virginia,
        maryland,
      },
      {
        where: {
          user_id: admin_id,
        },
      }
    );
    if (updatestatus) {
      res.status(200).json({ status: message_constants.US });
    }
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const admin_profile_mailing_billling_info_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {
        admin_id,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      } = req.body;
      // const { admin_id } = req.params;
      const adminprofile = await User.findOne({
        where: {
          user_id: admin_id,
        },
      });
      if (!adminprofile) {
        return res.status(404).json({ error: message_constants.ANF });
      }
      const updatestatus = await User.update(
        {
          address_1,
          address_2,
          city,
          state,
          zip,
          billing_mobile_no,
        },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (updatestatus) {
        res.status(200).json({ status: message_constants.US });
      }
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};
