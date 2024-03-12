import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import Region from "../../db/models/region_2";
import Profession from "../../db/models/profession_2";
import statusCodes from "../../public/status_codes";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";

/** Configs */
dotenv.config({ path: `.env` });

/**Admin in My Profile */
export const admin_profile_view = async (
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
        ],
      });
      if (!profile) {
        return res.status(404).json({ error: "Request not found" });
      }
      const regions = await Region.findAll({
        attributes: ["region_name"],
      });
      if (!regions) {
        res.status(500).json({ error: "Error fetching region data" });
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
          regions: regions?.map((region) => ({
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
      };
      formattedResponse.data.push(formattedRequest);
  
      return res.status(200).json({
        ...formattedResponse,
      });
    } catch (error) {
      console.error("Error fetching Admin Profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const admin_profile_reset_password = async (
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
          res.status(200).json({ status: "Successfull" });
        }
      }
    } catch (error) {
      console.error("Error setting password", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const admin_profile_admin_info_edit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { firstname, lastname, email, mobile_no, admin_id } = req.body;
      // const { admin_id } = req.params;
      const adminprofile = await User.findOne({
        where: {
          user_id: admin_id,
        },
      });
      if (!adminprofile) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const updatestatus = await User.update(
        {
          firstname,
          lastname,
          email,
          mobile_no,
        },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (updatestatus) {
        res.status(200).json({ status: "Updated Successfully" });
      }
    } catch (error) {
      console.error("Error fetching Admin Profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const admin_profile_mailing_billling_info_edit = async (
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
          return res.status(404).json({ error: "Admin not found" });
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
          res.status(200).json({ status: "Updated Successfully" });
        }
      } catch (error) {
        console.error("Error fetching Admin Profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
  