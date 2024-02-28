import { NextFunction, Request, Response } from "express";
import Notes from "../../models/notes";
import Order from "../../models/order";
import Patient from "../../models/patient";
import Transfer_Request from "../../models/transfer_request";
import statusCodes from "../../public/status_codes";
import nodemailer from "nodemailer";
import brcypt from "bcrypt";
import * as crypto from "crypto";
import RequestModel from "../../models/request";
import Provider from "../../models/provider";

export const view_case_for_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { requestId } = req.params;

  try {
    const request = await RequestModel.findOne({
      where: {
        request_id: requestId,
      },
      include: {
        model: Patient,
        attributes: [
          "firstname",
          "lastname",
          "dob",
          "mobile_number",
          "region",
          "business_name",
          "street",
          "city",
          "state",
          "zip",
          "address",
        ],
      },
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ request });
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
  const { state, requestId } = req.params;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.destroy({
      where: {
        request_state: state,
        request_id: requestId,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
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
  const { requestId, state } = req.params;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        block_status: "yes",
      },
      {
        where: {
          request_id: requestId,
          request_state: state,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
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
  const { requestId, state } = req.params;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        cancellation_status: "yes",
      },
      {
        where: {
          request_id: requestId,
          request_state: state,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
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
  const { requestId, state } = req.params;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await RequestModel.update(
      {
        close_case_status: "yes",
      },
      {
        where: {
          request_id: requestId,
          request_state: state,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
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
  const { requestId, state, notes_for } = req.params;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    const list = await Notes.findAll({
      where: {
        typeOfNote: notes_for,
        request_id: requestId,
        request_state: state,
      },
    });
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
      list,
    });
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
  const { requestId, state } = req.params;
  const {
    profession,
    businessName,
    businessContact,
    email,
    faxNumber,
    orderDetails,
    numberOfRefill,
  } = req.body;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await Order.create({
      requestId,
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
  } catch (error) {
    console.error("Error in Sending Order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const transfer_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { requestId, state } = req.params;
  const { physician_name, description } = req.body;
  try {
    const request = await RequestModel.findByPk(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    await Transfer_Request.create({
      requestId,
      physician_name,
      description,
    });
    await RequestModel.update(
      {
        transfer_request_status: "pending",
      },
      {
        where: {
          request_id: requestId,
          request_state: state,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
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
    const { requestId } = req.params;
    const { mobile_number, email } = req.body;
    const request = await RequestModel.findByPk(requestId, {
      include: {
        model: Patient,
        attributes: ["email", "mobile_number"],
      },
    });
    if (!request) {
      return res.status(400).json({
        message: "Invalid email address and mobile number",
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
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");

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
    const { region } = req.params;
    const physicians = await Provider.findAll({
      where: {
        role: "physician",
        region: region,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
      physicians,
    });
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
    const { requestId } = req.params;
    const { firstname, lastname, assign_req_description } = req.body;
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
          request_id: requestId,
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error("Error in Assigning Request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
