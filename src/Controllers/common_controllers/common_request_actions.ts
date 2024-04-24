import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Business from "../../db/models/business-vendor";
import {
  Controller,
  FormattedResponse,
} from "../../interfaces/common_interface";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";
import Logs from "../../db/models/log";
import archiver from "archiver";
import twilio from "twilio";
import { send_email_with_attachment } from "../../utils";

/** Configs */
dotenv.config({ path: `.env` });

/**Common Request Actions */

/**
 * @description Given below functions are Express controllers that allows viewing request by confirmation number.
 */
export const view_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      attributes: ["request_id", "request_state", "confirmation_no"],
      include: [
        {
          as: "Patient",
          model: User,
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
            "state",
            "business_name",
            "address_1",
          ],
          where: {
            type_of_user: "patient",
          },
          required: false,
        },
        {
          model: Notes,
          attributes: ["request_id", "note_id", "description", "type_of_note"],
          required: false,
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formatted_request = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      // requested_date: request.requested_date.toISOString().split("T")[0],
      patient_data: {
        user_id: request.Patient.user_id,
        patient_notes: request.Notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        // DOB: request.Patient.dob
        //   .toISOString()
        //   .split("T")[0]
        //   .split("-")
        //   .map(Number)
        //   .reverse()
        //   .join("-"),
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        location_information: {
          region: request.Patient.state,
          business_name: request.Patient.business_name,
          room: request.Patient.address_1 + " " + request.Patient.address_2,
        },
      },
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description These functions handles various actions related to uploads for a request.
 */
export const view_uploads_view_data: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },

      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname"],
          where: {
            type_of_user: "patient",
          },
        },
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formatted_request = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmationNo: request.confirmation_no,
      patientData: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
      },
      documents: request.Documents?.map((document) => ({
        document_id: document.document_id,
        document_path: document.document_path,
        createdAt: document.createdAt.toISOString().split("T")[0],
      })),
    };
    formatted_response.data.push(formatted_request);
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);
    const file = req.file;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const new_document = await Documents.create({
      request_id: request.request_id,
      document_path: file.path,
    });

    // console.log(new_document);

    if (!new_document) {
      return res.status(404).json({ error: message_constants.FTU });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.UpS,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    // const fileURL = file.path;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      include: [
        {
          model: Documents,
          attributes: [
            "request_id",
            "document_id",
            "document_path",
            "createdAt",
          ],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: message_constants.DNF });
    }

    const delete_status = await Documents.destroy({
      where: {
        request_id: request.request_id,
        document_id,
      },
    });

    if (!delete_status) {
      return res.status(404).json({ error: message_constants.EWD });
    }

    return res.status(200).json({
      status: true,
      confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_actions_download: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id: document_id,
      },
      attributes: ["document_id", "document_path"],
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
        "public",
        "uploads",
        file_path
      );
    }

    // Check for file existence and send error if not found
    if (!fs.existsSync(file_path)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(file_path)}"`
    );

    // Initiate file download with `res.sendFile`
    res.sendFile(file_path, (error) => {
      if (error) {
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("Downloaded!!!");
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_delete_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { document_ids } = req.body as {
      document_ids: Array<number>;
    };
    let deleted_count;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    let count = 0;

    for (const document_id of document_ids) {
      deleted_count = await Documents.destroy({
        where: {
          request_id: request.request_id,
          document_id,
        },
      });
      if (deleted_count === 0) {
        return res
          .status(200)
          .json({ message: message_constants.NDF } + " for " + document_id);
      }
      count++;
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: `Successfully deleted ${count} document(s)`,
    });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_uploads_download_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { document_ids } = req.body as {
      document_ids: Array<number>;
    };

    if (document_ids.length === 0) {
      return res.status(200).json({ message: "No documents selected" });
    }

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      include: [
        {
          as: "Documents",
          model: Documents,
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Create the directory if it doesn't exist
    const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const zip_filename = `${confirmation_no}_documents.zip`;
    const zip_file_path = path.join(uploadsDir, zip_filename);

    // Create a zip file
    const output = fs.createWriteStream(zip_file_path);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", (err: any) => {
      throw err;
    });

    archive.pipe(output);

    // Add files to the zip archive
    for (const document_id of document_ids) {
      const is_document = await Documents.findOne({
        where: {
          document_id,
          request_id: request.request_id,
        },
      });

      if (!is_document) {
        return res.status(404).json({
          message: message_constants.DNF + " for " + document_id,
        });
      }

      const file = await Documents.findOne({
        where: {
          document_id: document_id,
        },
      });

      if (!file) {
        return res.status(404).json({
          message: message_constants.DNF,
        });
      }

      const file_path = file.document_path;
      const filename = path.basename(file_path);

      // Check for file existence before adding to the archive
      if (fs.existsSync(file_path)) {
        archive.append(fs.createReadStream(file_path), { name: filename });
        console.log(`Added ${filename} to the zip archive.`);
      } else {
        console.error(`File not found: ${file_path}`);
      }
    }

    // Finalize the zip archive
    await archive.finalize();

    // Set response headers for file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${zip_filename}`
    );

    // Stream the zip file to the response
    const fileStream = fs.createReadStream(zip_file_path);
    fileStream.pipe(res);

    // Cleanup: Remove the zip file after streaming
    fileStream.on("close", () => {
      fs.unlinkSync(zip_file_path);
      console.log(`Removed ${zip_filename} after streaming.`);
    });
  } catch (error) {
    console.error("Error downloading documents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_send_mail: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { document_ids } = req.body as {
      document_ids: Array<number>;
    };

    if (document_ids.length === 0) {
      return res.status(200).json({ message: "No documents selected" });
    }

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      include: [
        {
          as: "Documents",
          model: Documents,
        },
        {
          as: "Patient",
          model: User,
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    for (const document_id of document_ids) {
      const is_document = await Documents.findOne({
        where: {
          document_id,
          request_id: request.request_id,
        },
      });

      if (!is_document) {
        return res.status(404).json({
          message: message_constants.DNF + " for " + document_id,
        });
      }
    }

    const zip_filename = `${confirmation_no}_documents.zip`;
    const zip_file_path = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      zip_filename
    );

    // Create a zip file
    const output = fs.createWriteStream(zip_file_path);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", (err: any) => {
      throw err;
    });

    archive.pipe(output);

    // Add files to the zip archive
    for (const document of document_ids) {
      const file = await Documents.findOne({
        where: {
          document_id: document,
        },
      });
      if (!file) {
        return res.status(404).json({
          message: message_constants.DNF,
        });
      }
      const file_path = file.document_path;
      const filename = path.basename(file_path);

      // Check for file existence before adding to the archive
      if (fs.existsSync(file_path)) {
        archive.append(fs.createReadStream(file_path), { name: filename });
        console.log(`Added ${filename} to the zip archive.`);
      } else {
        console.error(`File not found: ${file_path}`);
      }
    }

    // Finalize the zip archive
    await archive.finalize();

    const downloadLink = `http://http://localhost:3000/dashboard/viewupload`;

    const mail_content = `
        
      You can download the requested documents from the following link:${downloadLink}

      This link will be valid for 24 hours.
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
      to: request.Patient.email,
      subject: "Downloads",
      text: mail_content,
    });

    if (!info) {
      return res.status(500).json({
        message: message_constants.EWSL,
      });
    }
    const email_log = await Logs.create({
      type_of_log: "Email",
      action: "For Sending downloads",
      role_name: "Admin",
      email: request.Patient.email,
      sent: "Yes",
      confirmation_no: confirmation_no,
    });

    if (!email_log) {
      return res.status(500).json({
        message: message_constants.EWCL,
      });
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.error("Error downloading documents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_uploads_send_mail_refactored: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { document_ids } = req.body as {
      document_ids: Array<number>;
    };

    if (document_ids.length === 0) {
      return res.status(200).json({ message: "No documents selected" });
    }

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      include: [
        {
          as: "Documents",
          model: Documents,
        },
        {
          as: "Patient",
          model: User,
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const zip_filename = `${confirmation_no}_documents.zip`;
    const zip_file_path = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      zip_filename
    );

    // Create a zip file
    const output = fs.createWriteStream(zip_file_path);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );

      // Send email with the zip file attached
      send_email_with_attachment(
        request.Patient.email,
        zip_file_path,
        zip_filename
      )
        .then(() => {
          // Log successful email sending
          return Logs.create({
            type_of_log: "Email",
            action: "For Sending downloads",
            role_name: "Admin",
            email: request.Patient.email,
            sent: "Yes",
            confirmation_no: confirmation_no,
          });
        })
        .then(() => {
          // Delete the zip file after sending email
          fs.unlinkSync(zip_file_path);
          console.log(`Removed ${zip_filename} after sending email.`);
          return res.status(200).json({
            message: "Email sent successfully with the requested documents.",
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
        });
    });

    archive.on("error", (err: any) => {
      throw err;
    });

    archive.pipe(output);

    // Add files to the zip archive
    for (const document_id of document_ids) {
      const file = await Documents.findOne({
        where: {
          document_id: document_id,
        },
      });
      if (!file) {
        return res.status(404).json({
          message: message_constants.DNF,
        });
      }
      const file_path = file.document_path;
      const filename = path.basename(file_path);

      // Check for file existence before adding to the archive
      if (fs.existsSync(file_path)) {
        archive.append(fs.createReadStream(file_path), { name: filename });
        console.log(`Added ${filename} to the zip archive.`);
      } else {
        console.error(`File not found: ${file_path}`);
      }
    }

    // Finalize the zip archive
    await archive.finalize();
  } catch (error) {
    console.error("Error downloading documents:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @description These functions handles viewing and sending orders for a request.
 */
export const business_name_for_send_orders: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profession = req.query;
    const where_clause = {
      // profession: profession  // Commented out for dynamic filtering
      ...(profession && { profession: profession }),
    };
    const businesses = await Business.findAll({
      attributes: ["business_name"],
      // where: where_clause,
    });
    if (!businesses) {
      res.status(500).json({ error: message_constants.EFBD });
    }
    return res
      .status(200)
      .json({ status: message_constants.Success, businesses: businesses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const view_send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profession, business } = req.query as {
      [key: string]: string;
    };
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const business_data = await Business.findOne({
      where: {
        business_name: business,
        profession: profession,
      },
    });
    if (!business_data) {
      return res.status(404).json({ error: message_constants.BNF });
    }
    const formatted_request = {
      business_contact: business_data?.business_contact,
      email: business_data?.email,
      fax_number: business_data?.fax_number,
    };
    formatted_response.data.push(formatted_request);
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const send_orders_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { business_contact, email } = req.query as {
      [key: string]: string;
    };
    const { order_details, number_of_refill } = req.body;
    if (state == "active" || "conclude" || "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          request_status: {
            [Op.notIn]: [
              "cancelled by admin",
              "cancelled by provider",
              "blocked",
              "clear",
            ],
          },
        },
      });
      if (!request) {
        return res.status(404).json({ error: message_constants.RNF });
      }
      const business = await Business.findOne({
        where: {
          business_contact,
          email,
        },
      });
      if (!business) {
        return res.status(404).json({ error: message_constants.BNF });
      }
      await Order.create({
        request_id: request.request_id,
        business_id: business.business_id,
        request_state: state,
        order_details,
        number_of_refill,
      });
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: message_constants.Success,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description This function handles sending and updating agreements for a request.
 */
export const send_agreement: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { mobile_no, email } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
        mobile_no: mobile_no,
        type_of_user: "patient",
      },
      attributes: ["user_id", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id: user.user_id,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },

      include: {
        as: "Patient",
        model: User,
        attributes: ["email", "mobile_no"],
        where: {
          type_of_user: "patient",
        },
      },

      /** Above include is temporarily commented out */
    });
    if (!request) {
      return res.status(400).json({
        message: message_constants.RNF,
      });
    }

    // const reset_url = `http://localhost:7000/admin/dashboard/requests/${confirmation_no}/actions/updateagreement`;
    const reset_url = `http://localhost:3000/agreement`;

    const mail_content = `
            <html>
  
            <p>Click below button to re-view agreement </p>
            <br>
            <br>
            <button> <a href="${reset_url}"> agreement </a> </button>
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
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Agreement",
      html: mail_content,
    });
    if (!info) {
      return res.status(500).json({
        message: message_constants.EWSA,
      });
    }

    const account_sid = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(account_sid, auth_token);

    client.messages
      .create({
        body: `Click the link to review agreement. Link :- ${reset_url}`,
        from: process.env.TWILIO_MOBILE_NO,
        // to: "+" + mobile_no,
        to: "+918401736963",
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error(error));

    const SMS_log = await Logs.create({
      type_of_log: "SMS",
      recipient: user.firstname + " " + user.lastname,
      action: "For Sending Request Link",
      mobile_no: mobile_no,
      sent: "Yes",
    });
    if (!SMS_log) {
      return res.status(500).json({
        message: message_constants.EWCL,
      });
    }

    const email_log = await Logs.create({
      type_of_log: "Email",
      recipient: user.firstname + " " + user.lastname,
      action: "For Agreement",
      role_name: "Admin",
      email: user.email,
      sent: "Yes",
      confirmation_no: confirmation_no,
    });

    if (!email_log) {
      return res.status(500).json({
        message: message_constants.EWCL,
      });
    }

    return res.status(200).json({
      confirmation_no: confirmation_no,
      message: message_constants.ASEM,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: message_constants.ESA,
      errormessage: message_constants.ISE,
    });
  }
};
export const update_agreement_agree: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const update_status = await RequestModel.update(
      { agreement_status: "accepted" },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update_status) {
      res.status(200).json({
        status: true,
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const update_agreement_cancel: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { cancel_confirmation } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const update_status = await RequestModel.update(
      {
        agreement_status: "rejected",
        request_state: "toclose",
        request_status: "closed",
      },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update_status) {
      res.status(200).json({
        status: true,
        message: message_constants.EWU,
      });
    }

    const note = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "patient_cancellation_notes",
      },
    });

    if (note) {
      const update_note = await Notes.update(
        {
          description: cancel_confirmation,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "patient_cancellation_notes",
          },
        }
      );
      if (!update_note) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    } else {
      const create_note = await Notes.create({
        request_id: request.request_id,
        type_of_note: "patient_cancellation_notes",
        description: cancel_confirmation,
      });
      if (!create_note) {
        return res.status(500).json({
          message: message_constants.EWC,
        });
      }
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
