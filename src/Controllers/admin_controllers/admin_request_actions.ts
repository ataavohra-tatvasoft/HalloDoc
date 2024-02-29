import { NextFunction, Request, Response } from "express";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Patient from "../../db/models/patient";
import statusCodes from "../../public/status_codes";
import nodemailer from "nodemailer";
import * as crypto from "crypto";
import RequestModel from "../../db/models/request";
import Provider from "../../db/models/provider";
// import brcypt from "bcrypt";

export const view_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    if (
      state === "new" ||
      "active" ||
      " pending" ||
      "conclude" ||
      "toclose" ||
      "unpaid"
    ) {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          block_status: "no",
          cancellation_status: "no",
          close_case_status: "no",
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "notes_symptoms",
        ],
        include: {
          model: Patient,
          attributes: [
            "confirmation_no",
            "firstname",
            "lastname",
            "dob",
            "mobile_number",
            "business_name",
            "address",
            "region",
            "street",
            "city",
            "state",
            "zip",
          ],
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json({ request });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const clear_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, confirmation_no } = req.params;
    if (state === "pending" || "toclose") {
      const request = await RequestModel.findOne({
        where: { confirmation_no },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await RequestModel.destroy({
        where: {
          request_state: state,
          confirmation_no: confirmation_no,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const block_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    if (state === "new") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await RequestModel.update(
        {
          block_status: "yes",
        },
        {
          where: {
            confirmation_no: confirmation_no,
            request_state: state,
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const cancel_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { reason, additional_notes } = req.body;
    if (state === "new") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          cancellation_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await RequestModel.update(
        {
          cancellation_status: "yes",
        },
        {
          where: {
            request_id: request.request_id,
            request_state: state,
          },
        }
      );
      const find_note = await Notes.findOne({
        where: {
          requestId: request.request_id,
          typeOfNote: "admin_cancellation_notes",
        },
      });
      if (find_note) {
        Notes.update(
          {
            description: additional_notes,
            reason: reason,
          },
          {
            where: {
              requestId: request.request_id,
              typeOfNote: "admin_cancellation_notes",
            },
          }
        );
      } else {
        Notes.create({
          requestId: request.request_id,
          typeOfNote: "admin_cancellation_notes",
          description: additional_notes,
          reason: reason,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { firstname, lastname, dob, mobile_number, email } = req.body;
    if (state === "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          close_case_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      const patient_data = await Patient.findOne({
        where: { patient_id: request.patient_id },
      });
      if (!patient_data) {
        return res.status(404).json({ error: "Patient not found" });
      }
      await Patient.update(
        {
          firstname,
          lastname,
          dob,
          mobile_number,
          email,
        },
        {
          where: {
            patient_id: request.patient_id,
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const close_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;

    if (state === "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          close_case_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await RequestModel.update(
        {
          close_case_status: "yes",
        },
        {
          where: {
            confirmation_no: confirmation_no,
            request_state: state,
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const view_notes_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state, notes_for } = req.params;
    if (
      state === "new" ||
      "active" ||
      " pending" ||
      "conclude" ||
      "toclose" ||
      "unpaid"
    ) {
      const request = await await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      const list = await Notes.findAll({
        where: {
          request_id: request.request_id,
          request_state: state,
          typeOfNote: notes_for,
        },
        include: ["description"],
      });
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
        list,
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const save_view_notes_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { new_note } = req.body;
    if (
      state === "new" ||
      "active" ||
      " pending" ||
      "conclude" ||
      "toclose" ||
      "unpaid"
    ) {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      const list = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            request_id: request.request_id,
            typeOfNote: "admin_notes",
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
        list,
      });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_orders_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const {
      profession,
      businessName,
      businessContact,
      email,
      faxNumber,
      orderDetails,
      numberOfRefill,
    } = req.body;
    if (state === "active" || "conclude" || "toclose") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no: confirmation_no,
          request_state: state,
          block_status: "no",
          cancellation_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await Order.create({
        requestId: request.request_id,
        profession,
        businessName,
        businessContact,
        email,
        faxNumber,
        orderDetails,
        numberOfRefill,
      });
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error in Sending Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const transfer_request_region = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, state } = req.params;
    if (state === " pending") {
      const physicians = await Provider.findAll({
        where: {
          role: "physician",
          region: region,
        },
        include: ["region", " firstname", "lastname"],
      });

      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
        physicians,
      });
    }
  } catch (error) {
    console.error("Error in fetching Physicians:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const transfer_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { physician_name, description } = req.body;
    if (state == "pending") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no,
          block_status: "no",
          cancellation_status: "no",
          close_case_status: "no",
        },
      });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      await Notes.create({
        requestId: request.request_id,
        physician_name,
        description,
        typeOfNote: "transfer_notes",
      });
      await RequestModel.update(
        {
          transfer_request_status: "pending",
        },
        {
          where: {
            request_id: request.request_id,
            request_state: state,
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error in Sending Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const send_agreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { mobile_number, email } = req.body;
    if (state === " pending") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no,
          block_status: "no",
          cancellation_status: "no",
          close_case_status: "no"
        },
        include: {
          model: Patient,
          attributes: ["email", "mobile_number"],
        },
      });
      if (!request) {
        return res.status(400).json({
          message: "Invalid request case",
          errormessage: statusCodes[400],
        });
      }
      const user = await Patient.findOne({
        where: { email, mobile_number },
      });
      if (!user) {
        return res.status(400).json({
          message: "Invalid email address and mobile number",
          errormessage: statusCodes[400],
        });
      }

      // const resetToken = uuid();
      const resetToken = crypto
        .createHash("sha256")
        .update(email)
        .digest("hex");

      const resetUrl = `http://localhost:7000/admin/dashboard/requests/:state/:requestId/actions/updateagreement`;
      const mailContent = `
      <html>
      <form action = "${resetUrl}" method="POST"> 
      <p>Tell us that you accept the agreement or not:</p>
      <p>Your token is: ${resetToken}</p>
      <br>
      <br>
      <label for="ResetToken">Token:</label>
      <input type="text" id="ResetToken" name="ResetToken" required>
      <br>
      <br>
      <label for="agreement_status">Agreement_Status:</label>
      <select id="agreement_status">
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
    <br>
    <br>
      <button type = "submit">Submit Response</button>
      </form>
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
        to: email,
        subject: "Agreement",
        html: mailContent,
      });

      res.status(200).json({
        message: "Agreement sent to your email",
        errormessage: statusCodes[200],
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending Agreement",
      errormessage: statusCodes[500],
    });
  }
};
export const assign_request_region = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, state } = req.params;
    if (state === "new") {
      const physicians = await Provider.findAll({
        where: {
          role: "physician",
          region: region,
        },
        include: ["region", " firstname", "lastname"],
      });

      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
        physicians,
      });
    }
  } catch (error) {
    console.error("Error in fetching Physicians:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const assign_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, state } = req.params;
    const { firstname, lastname, assign_req_description } = req.body;
    if (state === "new") {
      const provider = await Provider.findOne({
        where: {
          firstname,
          lastname,
          role: "physician",
        },
      });
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      const physician_id = provider.provider_id;
      await RequestModel.update(
        {
          physician_id,
          assign_req_description,
        },
        {
          where: {
            confirmation_no: confirmation_no,
          },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Successfull !!!",
      });
    }
  } catch (error) {
    console.error("Error in Assigning Request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
