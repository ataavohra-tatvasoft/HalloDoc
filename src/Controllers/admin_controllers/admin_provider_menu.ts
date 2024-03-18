import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user_2";
import RequestModel from "../../db/models/request_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Op, where } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Provider Menu                                    */

export const provider_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, page, pageSize } = req.query as {
      region: string;
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
        "stop_notification_status",
        "firstname",
        "lastname",
        "role",
        "on_call_status",
        "status",
      ],
      where: {
        ...(region && { state: region }),
        type_of_user: "provider",
      },
    });
    var i = offset + 1;
    for (const provider of providers) {
      const formattedRequest: any = {
        sr_no: i,
        user_id: provider.user_id,
        stop_notification: provider.stop_notification_status,
        provider_name: provider.firstname + " " + provider.lastname,
        role: provider.role,
        on_call_status: provider.on_call_status,
        status: provider.status,
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

export const stop_notification: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { stop_notification_status } = req.query as {
      stop_notification_status: string;
    };

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    await User.update(
      { stop_notification_status: stop_notification_status },
      {
        where: {
          user_id,
        },
      }
    );
    return res.status(200).json({
      message: message_constants.US,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const contact_your_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { email, mobile_no } = req.query;
    const { message } = req.body;
    const user = await User.findOne({
      where: {
        user_id,
        type_of_user: "provider",
      },
      attributes: ["user_id", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    if (email) {
      const mailContent = `
          <html>
          <p>Given below is a message from admin:</p>
          <br>
          <br>
          <p>Message: ${message} </p>
          <br>
          <br>
          <br>
          <br>
          </html>
        `;

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
      const info = await transporter.sendMail({
        from: "vohraatta@gmail.com",
        to: user.email,
        subject: "Message",
        html: mailContent,
      });
      if (!info) {
        res.status(500).json({
          message: message_constants.EWSM,
        });
      }
      return res.status(200).json({
        message: message_constants.ES,
      });
    }
    if (mobile_no) {
      const accountSid = "AC755f57f9b0f3440c6d2a207bd5678bdd";
      const authToken = "a795f37433f7542bea73622828e66841";
      const client = twilio(accountSid, authToken);

      await client.messages.create({
        body: `Message from admin: ${message}`,
        from: "+15187597839",
        to: "+91" + mobile_no,
      });

      return res.status(200).json({
        status: true,
        message: message_constants.MS,
      });
    }
  } catch (error) {
    return res.status(500).json({
      errormessage: message_constants.ISE,
    });
  }
};

export const view_edit_physician_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const profile = await User.findOne({
      where: {
        user_id,
        type_of_user: "provider",
      },
      attributes: [
        "type_of_user",
        "user_id",
        "username",
        "status",
        "role",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "medical_licence",
        "NPI_no",
        "synchronization_email",
        "district_of_columbia",
        "new_york",
        "virginia",
        "maryland",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
        "business_name",
        "business_website",
        "admin_notes",
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }
    const documents = await Documents.findAll({
      attributes: ["document_id", "document_name", "document_path"],
      where: {
        user_id,
      },
    });
    if (!documents) {
      res.status(500).json({ error: message_constants.DNF });
    }
    const formattedRequest: any = {
      user_id: profile.user_id,
      account_information: {
        username: profile.username,
        status: profile.status,
        role: profile.role,
      },
      physician_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        medical_licence: profile.medical_licence,
        NPI_number: profile.NPI_no,
        synchronization_email: profile.synchronization_email,
        service_areas_availability: {
          district_of_columbia: profile.district_of_columbia,
          new_york: profile.new_york,
          virginia: profile.virginia,
          maryland: profile.maryland,
        },
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
        admin_notes: profile.admin_notes,
      },
      onboarding: {
        documents: documents?.map((document: any) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const physician_account_reset_password: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { password, user_id },
    } = req;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user_data = await User.findOne({
      where: {
        user_id,
      },
    });
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword },
        {
          where: {
            user_id,
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

export const save_account_information: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { user_id, username, status, role },
    } = req;

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    const update_status = await User.update(
      { username, status, role },
      {
        where: {
          user_id,
        },
      }
    );
    if (update_status) {
      return res.status(200).json({
        message: message_constants.US,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const save_physician_information: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        user_id,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        district_of_columbia,
        new_york,
        virginia,
        maryland,
      },
    } = req;

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    const update_status = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        district_of_columbia,
        new_york,
        virginia,
        maryland,
      },
      {
        where: {
          user_id,
        },
      }
    );
    if (update_status) {
      return res.status(200).json({
        message: message_constants.US,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const save_mailing_billing_info: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {
        user_id,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      } = req.body;
      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
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
            user_id,
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

export const save_provider_profile: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { user_id, business_name, business_website, admin_notes } =
        req.body;

      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
      }
      const updatestatus = await User.update(
        {
          business_name,
          business_website,
          admin_notes,
        },
        {
          where: {
            user_id,
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

export const delete_provider_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { user_id } = req.params;

      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
      }

      const delete_document = await Documents.destroy({
        where: {
          user_id,
        },
      });
      if (!delete_document) {
        return res.status(404).json({ error: message_constants.EWDD });
      }
      const delete_order = await Order.destroy({
        where: {
          user_id,
        },
      });
      if (!delete_order) {
        return res.status(404).json({ error: message_constants.EWDO });
      }
      const delete_profile = await User.destroy({
        where: {
          user_id,
        },
      });
      if (!delete_profile) {
        return res.status(404).json({ error: message_constants.EWDP });
      }
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};

export const provider_profile_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { profile_photo, signature_photo } = req.file;
      
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};
