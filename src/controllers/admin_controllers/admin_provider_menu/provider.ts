import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import path from "path";
import fs from "fs";
import { WhereOptions } from "sequelize";
import {
  Controller,
  FormattedResponse,
  File,
  UserAttributes,
} from "../../../interfaces";
import message_constants from "../../../constants/message_constants";
import { update_region_mapping, update_document } from "../../../utils";
import {
  Documents,
  User,
  RequestModel,
  Region,
  UserRegionMapping,
  Role,
  Logs,
  Shifts,
} from "../../../db/models";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Provider Menu                                    */

export const provider_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const where_clause: WhereOptions<UserAttributes> = {
      type_of_user: "physician",
      ...(region && { state: region }),
    };
    const { count: total_count, rows: providers } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "email",
        "mobile_no",
        "stop_notification_status",
        "firstname",
        "lastname",
        "role_id",
        "on_call_status",
        "status",
      ],
      where: where_clause,
    });

    var i = offset + 1;
    for (const provider of providers) {
      const role = await Role.findOne({
        where: {
          role_id: provider.role_id,
        },
      });
      const formatted_request = {
        sr_no: i,
        user_id: provider.user_id,
        stop_notification: provider.stop_notification_status,
        provider_name: provider.firstname + " " + provider.lastname,
        email: provider?.email,
        mobile_no: provider?.mobile_no,
        role: role?.role_name,
        on_call_status: provider.on_call_status,
        status: provider.status,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
      total_pages: Math.ceil(total_count / limit),
      current_page: page_number,
      total_count: total_count,
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
    // const { user_id } = req.params;
    const { user_ids, stop_notification_status } = req.body as {
      user_ids: Array<number>;
      stop_notification_status: string;
    };

    for (const user_id of user_ids) {
      const user = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: message_constants.UNF + " for " + user_id });
      }
    }

    for (const user_id of user_ids) {
      await User.update(
        { stop_notification_status: stop_notification_status },
        {
          where: {
            user_id,
          },
        }
      );
    }
    return res.status(200).json({
      message: message_constants.US,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const contact_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { email, mobile_no } = req.query as {
      [key: string]: string;
    };
    const { message } = req.body;
    const user = await User.findOne({
      where: {
        user_id,
        type_of_user: "physician",
      },
      attributes: ["user_id", "firstname", "lastname", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    if (email && mobile_no) {
      console.log("email and mobile");
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

      const email_log = await Logs.create({
        type_of_log: "Email",
        recipient: user.firstname + " " + user.lastname,
        action: "For contacting provider",
        role_name: "Admin",
        email: user.email,
        sent: "Yes",
      });

      if (!email_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }

      const account_sid = process.env.TWILIO_ACCOUNT_SID;
      const auth_token = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(account_sid, auth_token);

      await client.messages.create({
        body: `Message from admin: ${message}`,
        from: process.env.TWILIO_MOBILE_NO,
        // to: "+" + mobile_no,
        to: "+918401736963",
      });

      const SMS_log = await Logs.create({
        type_of_log: "SMS",
        recipient: user.firstname + " " + user.lastname,
        action: "For contacting provider",
        role_name: "Admin",
        // mobile_no: user.mobile_no,
        mobile_no: BigInt(user.mobile_no),
        sent: "Yes",
      });
      if (!SMS_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }

      return res.status(200).json({
        status: true,
        message: message_constants.ES + " " + message_constants.MS,
      });
    }
    if (email) {
      console.log("email");
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

      const email_log = await Logs.create({
        type_of_log: "Email",
        action: "For contacting provider",
        role_name: "Admin",
        email: user.email,
        sent: "Yes",
      });

      if (!email_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }

      return res.status(200).json({
        message: message_constants.ES,
      });
    }
    if (mobile_no) {
      console.log("mobile");
      const account_sid = process.env.TWILIO_ACCOUNT_SID;
      const auth_token = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(account_sid, auth_token);

      await client.messages.create({
        body: `Message from admin: ${message}`,
        from: process.env.TWILIO_MOBILE_NO,
        // to: "+" + mobile_no,
        to: "+918401736963",
      });

      const SMS_log = await Logs.create({
        type_of_log: "SMS",
        action: "For contacting provider",
        role_name: "Admin",
        // mobile_no: user.mobile_no,
        mobile_no: BigInt(user.mobile_no),
        sent: "Yes",
      });
      if (!SMS_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }
      return res.status(200).json({
        status: true,
        message: message_constants.MS,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: message_constants.ISE,
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
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const profile = await User.findOne({
      where: {
        user_id,
        type_of_user: "physician",
      },
      attributes: [
        "type_of_user",
        "user_id",
        "username",
        "status",
        "role_id",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "medical_licence",
        "NPI_no",
        "synchronization_email",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
        "business_name",
        "business_website",
        "admin_notes",
        "profile_picture",
        "signature_photo",
      ],
      include: [
        {
          model: Region,
        },
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }
    const documents = await Documents.findAll({
      attributes: ["document_id", "document_name", "document_path"],
      where: {
        user_id,
        // document_name:
        //   "independent_contractor_agreement" ||
        //   "background_check" ||
        //   "HIPAA" ||
        //   "non_disclosure_agreement" ||
        //   "licence_document",
      },
    });
    if (!documents) {
      res.status(500).json({ error: message_constants.DNF });
    }
    const role = await Role.findOne({
      where: {
        role_id: profile.role_id,
      },
    });
    const formatted_request = {
      user_id: profile.user_id,
      account_information: {
        username: profile.username,
        status: profile.status,
        role: role?.role_name,
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
          regions: profile.Regions?.map((region) => ({
            region_id: region.region_id,
            region_name: region.region_name,
          })),
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
        business_name: profile.business_name || null,
        business_website: profile.business_website || null,
        admin_notes: profile.admin_notes || null,
        profile_picture: profile.profile_picture || null,
        signature_photo: profile.signature_photo || null,
      },
      onboarding: {
        documents: documents?.map((document: any) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
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
        { password: hashedPassword, status: "active" },
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
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const save_user_information: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      user_id,
      username,
      status,
      role,
      firstname,
      lastname,
      email,
      mobile_no,
      medical_licence,
      NPI_no,
      synchronization_email,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
      business_name,
      business_website,
      admin_notes,
    } = req.body;

    const { region_ids } = req.body as {
      region_ids: Array<number>;
    };

    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }

    let found_role;

    if (role) {
      found_role = await Role.findOne({ where: { role_name: role } });
      if (!found_role) {
        return res.status(500).json({ message: message_constants.RoNF });
      }
    }

    const update_user_fields = {
      username,
      status,
      role_id: found_role?.role_id || null,
      firstname,
      lastname,
      email,
      mobile_no,
      medical_licence,
      NPI_no,
      synchronization_email,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
      business_name,
      business_website,
      admin_notes,
    };

    const update_status = await User.update(update_user_fields, {
      where: { user_id },
    });

    if (!update_status) {
      return res.status(500).json({ error: message_constants.ISE });
    }

    if (region_ids) {
      await update_region_mapping(user.user_id, region_ids, req, res, next);
    }

    return res.status(200).json({ message: message_constants.US });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
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
      // const related_requests = await RequestModel.findAll({
      //   where: { physician_id: user_id },
      // });

      // if (related_requests.length > 0) {
      //   const related_documents = await Documents.destroy({
      //     where: {
      //       request_id: related_requests.map((request) => request.request_id),
      //     },
      //   });
      //   if (!related_documents && related_documents != 0) {
      //     return res.status(400).json({ error: message_constants.EWDD });
      //   }
      //   const related_orders = await Order.destroy({
      //     where: {
      //       request_id: related_requests.map((request) => request.request_id),
      //     },
      //   });

      //   if (!related_orders && related_orders != 0) {
      //     return res.status(400).json({ error: message_constants.EWDO });
      //   }

      //   const related_notes = await Notes.destroy({
      //     where: {
      //       request_id: related_requests.map((request) => request.request_id),
      //     },
      //   });

      //   if (!related_notes && related_notes != 0) {
      //     return res.status(400).json({ error: message_constants.EWDN });
      //   }

      const update_status = await RequestModel.update(
        {
          physician_id: null,
          request_state: "new",
          request_status: "unassgined",
        },
        { where: { physician_id: user_id } }
      );

      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      const delete_shift_data = await Shifts.destroy({
        where: {
          user_id,
        },
      });

      if (!delete_shift_data && delete_shift_data != 0) {
        return res.status(404).json({ error: message_constants.EWD });
      }
      const delete_region_data = await UserRegionMapping.destroy({
        where: {
          user_id,
        },
      });

      if (!delete_region_data && delete_region_data != 0) {
        return res.status(404).json({ error: message_constants.EWD });
      }

      const delete_profile = await User.destroy({
        where: {
          user_id,
        },
      });

      if (!delete_profile) {
        return res.status(404).json({ error: message_constants.EWDP });
      }
      return res.status(200).json({
        message: message_constants.DS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

export const provider_profile_upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const uploaded_files: any = req.files || [];

    const user = await User.findOne({
      where: {
        user_id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }

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
        { where: { user_id } }
      );
      console.log(updated_user);
      if (updated_user[0] === 1) {
        return res.status(200).json({ status: message_constants.US });
      } else {
        return res.status(500).json({ error: message_constants.EWU });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const provider_onboarding_upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.body as { user_id: number };
    const user = await User.findOne({
      where: {
        user_id,
        type_of_user: "physician",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }

    const uploaded_files: File[] | { [fieldname: string]: File[] } =
      req.files || [];

    const independent_contractor_agreement_path =
      uploaded_files instanceof Array
        ? uploaded_files.find(
            (file: File) =>
              file.fieldname === "independent_contractor_agreement"
          )?.path
        : uploaded_files["independent_contractor_agreement"]?.[0].path;

    const background_check_path =
      uploaded_files instanceof Array
        ? uploaded_files.find(
            (file: File) => file.fieldname === "background_check"
          )?.path
        : uploaded_files["background_check"]?.[0].path;

    const HIPAA_path =
      uploaded_files instanceof Array
        ? uploaded_files.find((file: File) => file.fieldname === "HIPAA")?.path
        : uploaded_files["HIPAA"]?.[0].path;

    const non_disclosure_path =
      uploaded_files instanceof Array
        ? uploaded_files.find(
            (file: File) => file.fieldname === "non_disclosure"
          )?.path
        : uploaded_files["non_disclosure"]?.[0].path;

    const licence_document_path =
      uploaded_files instanceof Array
        ? uploaded_files.find(
            (file: File) => file.fieldname === "licence_document"
          )?.path
        : uploaded_files["licence_document"]?.[0].path;

    const update_document = async (
      document_name: string,
      document_path: string
    ) => {
      const document_status = await Documents.findOne({
        where: {
          user_id,
          document_name: document_name,
        },
      });

      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: document_name,
          document_path: document_path,
        });
      } else {
        await Documents.update(
          { document_path: document_path },
          {
            where: {
              user_id,
              document_name: document_name,
            },
          }
        );
      }
    };

    if (independent_contractor_agreement_path) {
      await update_document(
        "independent_contractor_agreement",
        independent_contractor_agreement_path
      );
    }

    if (background_check_path) {
      await update_document("background_check", background_check_path);
    }

    if (HIPAA_path) {
      await update_document("HIPAA", HIPAA_path);
    }

    if (non_disclosure_path) {
      await update_document("non_disclosure", non_disclosure_path);
    }

    if (licence_document_path) {
      await update_document("licence_document", licence_document_path);
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const provider_onboarding_view = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { user_id, document_id } = req.params;
    const { user_id } = req.params;
    const {
      independent_contractor_agreement,
      background_check,
      HIPAA,
      non_disclosure,
      licence_document,
    } = req.query;

    const is_user = await User.findOne({
      where: {
        user_id,
      },
      attributes: ["firstname", "lastname"],
    });

    if (!is_user) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }

    if (independent_contractor_agreement) {
      const document = await Documents.findOne({
        where: {
          user_id: user_id,
          // document_id: document_id,
          document_name: "independent_contractor_agreement",
        },
        attributes: ["document_id", "document_path", "document_name"],
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      let file_path = document.document_path;

      // Handle relative paths by joining with "uploads"
      if (!path.isAbsolute(file_path)) {
        file_path = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          file_path
        );
      }

      const file_extension = file_path.split(".").pop();

      // Check for file existence and send error if not found
      if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(
          `${is_user.firstname}_${is_user.lastname}__${document.document_name}.${file_extension}`
        )}"`
      );

      // Initiate file download with `res.sendFile`
      res.sendFile(file_path, (error) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Downloaded!!!");
        }
      });
    }
    if (background_check) {
      const document = await Documents.findOne({
        where: {
          user_id: user_id,
          // document_id: document_id,
          document_name: "background_check",
        },
        attributes: ["document_id", "document_path", "document_name"],
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      let file_path = document.document_path;

      // Handle relative paths by joining with "uploads"
      if (!path.isAbsolute(file_path)) {
        file_path = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          file_path
        );
      }

      const file_extension = file_path.split(".").pop();

      // Check for file existence and send error if not found
      if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(
          `${is_user.firstname}_${is_user.lastname}__${document.document_name}.${file_extension}`
        )}"`
      );

      // Initiate file download with `res.sendFile`
      res.sendFile(file_path, (error) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Downloaded!!!");
        }
      });
    }
    if (HIPAA) {
      const document = await Documents.findOne({
        where: {
          user_id: user_id,
          // document_id: document_id,
          document_name: "HIPAA",
        },
        attributes: ["document_id", "document_path", "document_name"],
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      let file_path = document.document_path;

      // Handle relative paths by joining with "uploads"
      if (!path.isAbsolute(file_path)) {
        file_path = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          file_path
        );
      }

      const file_extension = file_path.split(".").pop();

      // Check for file existence and send error if not found
      if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(
          `${is_user.firstname}_${is_user.lastname}__${document.document_name}.${file_extension}`
        )}"`
      );

      // Initiate file download with `res.sendFile`
      res.sendFile(file_path, (error) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Downloaded!!!");
        }
      });
    }
    if (non_disclosure) {
      const document = await Documents.findOne({
        where: {
          user_id: user_id,
          // document_id: document_id,
          document_name: "non_disclosure",
        },
        attributes: ["document_id", "document_path", "document_name"],
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      let file_path = document.document_path;

      // Handle relative paths by joining with "uploads"
      if (!path.isAbsolute(file_path)) {
        file_path = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          file_path
        );
      }

      const file_extension = file_path.split(".").pop();

      // Check for file existence and send error if not found
      if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(
          `${is_user.firstname}_${is_user.lastname}__${document.document_name}.${file_extension}`
        )}"`
      );

      // Initiate file download with `res.sendFile`
      res.sendFile(file_path, (error) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Downloaded!!!");
        }
      });
    }
    if (licence_document) {
      const document = await Documents.findOne({
        where: {
          user_id: user_id,
          // document_id: document_id,
          document_name: "licence_document",
        },
        attributes: ["document_id", "document_path", "document_name"],
      });

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      let file_path = document.document_path;

      // Handle relative paths by joining with "uploads"
      if (!path.isAbsolute(file_path)) {
        file_path = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          file_path
        );
      }

      const file_extension = file_path.split(".").pop();

      // Check for file existence and send error if not found
      if (!fs.existsSync(file_path)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(
          `${is_user.firstname}_${is_user.lastname}__${document.document_name}.${file_extension}`
        )}"`
      );

      // Initiate file download with `res.sendFile`
      res.sendFile(file_path, (error) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log("Downloaded!!!");
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const provider_onboarding_delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { document_id } = req.params;
    const delete_status = await Documents.destroy({
      where: {
        document_id,
      },
    });
    if (delete_status == 0) {
      return res.status(200).json({ message: message_constants.DNF });
    }
    return res.status(200).json({ message: message_constants.DS });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const create_provider_account_refactored: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        username,
        password,
        role,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
        business_name,
        business_website,
        admin_notes,
      },
      files,
    } = req;

    const { region_ids } = req.body as {
      region_ids: Array<number>;
    };

    const hashed_password: string = await bcrypt.hash(password, 10);
    const uploaded_files: any = files || {};

    const is_user = await User.findOne({
      where: {
        email,
      },
    });

    if (is_user) {
      return res.status(500).json({
        message: message_constants.UE,
      });
    }

    const get_file_path = (files: any, fieldname: string) => {
      if (!files || typeof files !== "object") {
        return null;
      }

      // If files is an array, use find
      if (Array.isArray(files)) {
        return (
          files.find((file: any) => file.fieldname === fieldname)?.path || null
        );
      }

      // If files is an object (e.g., from multer), use property access
      return files[fieldname]?.path || null;
    };

    const profile_picture_path = get_file_path(
      uploaded_files,
      "profile_picture"
    );
    const signature_photo_path = get_file_path(
      uploaded_files,
      "signature_photo"
    );
    const independent_contractor_agreement_path = get_file_path(
      uploaded_files,
      "independent_contractor_agreement"
    );
    const background_check_path = get_file_path(
      uploaded_files,
      "background_check"
    );
    const HIPAA_path = get_file_path(uploaded_files, "HIPAA");
    const non_disclosure_path = get_file_path(uploaded_files, "non_disclosure");

    const is_role = await Role.findOne({
      where: {
        role_name: role,
        account_type: "physician",
      },
    });
    if (!is_role) {
      return res.status(500).json({
        message: message_constants.RoNF,
      });
    }
    const user = await User.create({
      type_of_user: "physician",
      status: "active",
      username,
      password: hashed_password,
      role_id: is_role.role_id,
      firstname,
      lastname,
      email,
      mobile_no,
      medical_licence,
      NPI_no,
      synchronization_email,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
      business_name,
      business_website,
      admin_notes,
      profile_picture: profile_picture_path,
      signature_photo: signature_photo_path,
    });

    if (!user) {
      return res.status(500).json({ message: message_constants.EWCA });
    }

    if (region_ids) {
      await update_region_mapping(user.user_id, region_ids, req, res, next);
    }

    const update_document = async (
      user_id: number,
      document_name: string,
      document_path: string
    ) => {
      if (!document_path) return;
      const document_status = await Documents.findOne({
        where: { user_id, document_name },
      });
      if (!document_status) {
        await Documents.create({ user_id, document_name, document_path });
      } else {
        await Documents.update(
          { document_path },
          { where: { user_id, document_name } }
        );
      }
    };
    await update_document(
      user.user_id,
      "independent_contractor_agreement",
      independent_contractor_agreement_path
    );
    await update_document(
      user.user_id,
      "background_check",
      background_check_path
    );
    await update_document(user.user_id, "HIPAA", HIPAA_path);
    await update_document(user.user_id, "non_disclosure", non_disclosure_path);

    return res.status(200).json({ message: message_constants.Success });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const common_save_provider_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      body: {
        user_id,
        username,
        password,
        role,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
        business_name,
        business_website,
        admin_notes,
      },
      files,
    } = req;
    const { region_ids } = req.body as {
      region_ids: Array<number>;
    };
    const hashed_password: string = await bcrypt.hash(password, 10);
    const uploaded_files: any = files || {};

    const is_user = await User.findOne({
      where: { user_id, type_of_user: "physician" },
    });

    if (!is_user) {
      return res.status(404).json({ message: message_constants.UNF });
    }

    const get_file_path = (files: any, fieldname: string) => {
      if (!files || typeof files !== "object") {
        return null;
      }

      // If files is an array, use find
      if (Array.isArray(files)) {
        return (
          files.find((file: any) => file.fieldname === fieldname)?.path || null
        );
      }

      // If files is an object (e.g., from multer), use property access
      return files[fieldname]?.path || null;
    };

    const profile_picture_path = get_file_path(
      uploaded_files,
      "profile_picture"
    );
    const signature_photo_path = get_file_path(
      uploaded_files,
      "signature_photo"
    );
    const independent_contractor_agreement_path = get_file_path(
      uploaded_files,
      "independent_contractor_agreement"
    );
    const background_check_path = get_file_path(
      uploaded_files,
      "background_check"
    );
    const HIPAA_path = get_file_path(uploaded_files, "HIPAA");
    const non_disclosure_path = get_file_path(uploaded_files, "non_disclosure");

    const is_role = await Role.findOne({
      where: {
        role_name: role,
        account_type: "physician",
      },
    });
    if (!is_role) {
      return res.status(500).json({
        message: message_constants.RoNF,
      });
    }

    const user_update = await User.update(
      {
        type_of_user: "physician",
        status: "active",
        username,
        password: hashed_password,
        role_id: is_role.role_id,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
        business_name,
        business_website,
        admin_notes,
        profile_picture: profile_picture_path,
        signature_photo: signature_photo_path,
      },
      {
        where: {
          email: is_user.email,
        },
      }
    );

    if (!user_update) {
      return res.status(500).json({ message: message_constants.EWU });
    }

    if (region_ids) {
      await update_region_mapping(is_user.user_id, region_ids, req, res, next);
    }

    await update_document(
      is_user.user_id,
      "independent_contractor_agreement",
      independent_contractor_agreement_path
    );
    await update_document(
      is_user.user_id,
      "background_check",
      background_check_path
    );
    await update_document(is_user.user_id, "HIPAA", HIPAA_path);
    await update_document(
      is_user.user_id,
      "non_disclosure",
      non_disclosure_path
    );

    return res.status(200).json({ message: message_constants.Success });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
