import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user_2";
import RequestModel from "../../db/models/request_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import Business from "../../db/models/business_2";
import { where } from "sequelize";

/** Configs */
dotenv.config({ path: `.env` });

export const partner_vendor_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, profession, page, pageSize } = req.query as {
      firstname: string;
      lastname: string;
      profession: string;
      page: string;
      pageSize: string;
    };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "profession",
        "firstname",
        "lastname",
        "email",
        "fax_number",
        "mobile_no",
        "business_id",
      ],
      where: {
        ...(firstname && { firstname: firstname }),
        ...(lastname && { lastname: lastname }),
        ...(profession && { profession: profession }),
        type_of_user: "vendor",
        role: "vendor",
      },
    });
    var i = offset + 1;
    for (const provider of providers) {
      const business_data = await Business.findOne({
        where: {
          business_id: provider.business_id,
        },
      });
      if (!business_data) {
        return res.status(404).json({
          message:
            message_constants.BNF +
            " for" +
            provider.user_id +
            " with name: " +
            provider.firstname +
            " " +
            provider.lastname,
        });
      }
      const formattedRequest: any = {
        sr_no: i,
        user_id: provider.user_id,
        profession: provider.profession,
        business_name: business_data.business_name,
        name: provider.firstname + " " + provider.lastname,
        email: provider.email,
        fax_number: provider.fax_number,
        on_call_status: provider.on_call_status,
        mobile_no: provider.mobile_no,
        business_contact: business_data.business_contact,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }

    return res.status(200).json({
      ...formattedResponse,
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
      total_count: count,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};
