import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import Requestor from "../../db/models/requestor";
import User from "../../db/models/user";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import * as crypto from "crypto";
import bcrypt from "bcrypt";
import statusCodes from "../../public/status_codes";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: `.env` });

/**Admin Create Request */
export const create_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        FirstName,
        LastName,
        DOB,
        PhoneNumber,
        Email,
        AdminNotes,
        Region,
      },
    } = req;
    // const today = new Date();
    // console.log(today,today.getFullYear(),today.getFullYear().toString(),today.getFullYear().toString().slice(-2));
    const patient_data = await User.create({
      type_of_user: "patient",
      firstname: FirstName,
      lastname: LastName,
      dob: new Date(DOB),
      mobile_no: PhoneNumber,
      email: Email,
      region: Region,
    });
    if (!patient_data) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Patient!!!",
      });
    }
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
    const day = String(today.getDate()).padStart(2, "0"); // 0-padded day

    const todaysRequestsCount = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${today.toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${today.toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = `${patient_data.region.slice(
      0,
      2
    )}${year}${month}${day}${LastName.slice(0, 2)}${FirstName.slice(
      0,
      2
    )}${String(todaysRequestsCount + 1).padStart(4, "0")}`;
    const request_data = await RequestModel.create({
      request_state: "new",
      user_id: patient_data.user_id,
      requested_by: "Admin",
      requested_date: new Date(),
      confirmation_no: confirmation_no,
    });
    const admin_note = await Notes.create({
      requestId: request_data.request_id,
      //  requested_by: "Admin",
      description: AdminNotes,
      typeOfNote: "admin",
    });

    if (!patient_data && !request_data && !admin_note) {
      return res.status(400).json({
        status: false,
        message: "Failed To Create Request!!!",
      });
    }

    if (patient_data && request_data && admin_note) {
      return res.status(200).json({
        status: true,
        message: "Created Request Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error " + error.message,
      message: statusCodes[500],
    });
  }
};

/**Admin SignUp */
export const admin_signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    body: {
      Email,
      Confirm_Email,
      Password,
      Confirm_Password,
      Status,
      Role,
      FirstName,
      LastName,
      MobileNumber,
      Zip,
      Billing_MobileNumber,
      Address_1,
      Address_2,
      City,
      State,
      Country_Code,
    },
  } = req;
  const hashedPassword: string = await bcrypt.hash(Password, 10);
  try {
    const adminData = await User.create({
      type_of_user: "admin",
      email: Email,
      password: hashedPassword,
      status: Status,
      role: Role,
      firstname: FirstName,
      lastname: LastName,
      mobile_no: MobileNumber,
      zip: Zip,
      billing_mobile_no: Billing_MobileNumber,
      address_1: Address_1,
      address_2: Address_2,
      city: City,
      state: State,
      country_code: Country_Code,
    });

    if (!adminData) {
      return res.status(400).json({
        status: false,
        message: "Failed To SignUp!!!",
      });
    }

    if (adminData) {
      return res.status(200).json({
        status: true,
        message: "SignedUp Successfully !!!",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error  " + error.message,
      message: statusCodes[500],
    });
  }
};

/**Admin request by request_state and region */
export const requests_by_request_state = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state } = req.params;
    switch (state) {
      case "new": {
        {
          const requests = await RequestModel.findAll({
            where: { request_state: state },
            attributes: ["requested_date", "request_state"],
            include: [
              {
                model: User,
                attributes: [
                  "user_id",
                  "firstname",
                  "lastname",
                  "dob",
                  "mobile_no",
                  "address_1",
                ],
                where: {
                  type_of_user: "patient",
                },
              },
              {
                model: Requestor,
                attributes: ["user_id", "first_name", "last_name"],
              },
            ],
          });

          res.json(requests);
          break;
        }
      }

      case "pending": {
        {
          const requests = await RequestModel.findAll({
            where: { request_state: state },
            attributes: ["requested_date", "notes_symptoms", "date_of_service"],
            include: [
              {
                model: User,
                attributes: [
                  "user_id",
                  "firstname",
                  "lastname",
                  "dob",
                  "mobile_no",
                  "address_1",
                ],
                where: {
                  type_of_user: "patient",
                },
              },
              {
                model: Requestor,
                attributes: ["user_id", "first_name", "last_name"],
              },
              {
                model: User,
                where: { role: "physician", type_of_user: "provider" },
                attributes: ["user_id", "firstname", "lastname"],
              },
            ],
          });
          if (requests) {
            console.log("error");
          }
          res.json(requests);
          break;
        }
      }
      case "active": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["requested_date", "notes_symptoms", "date_of_service"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                type_of_user: "patient",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "conslude": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["requested_date", "date_of_service"],
          include: [
            {
              model: User,
              attributes: [
                "patient_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "toclose": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["date_of_service", "notes_symptoms"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "address_1",
                "region",
              ],
              where: {
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "unpaid": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["date_of_service"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
              ],
              where: {
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["provider_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      default: {
        res.status(500).json({ message: "Invalid State !!!" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requests_by_region = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, region } = req.params;
    if (region == "All Regions") {
      res.redirect("/dashboard/requests/:state");
    }
    switch (state) {
      case "new": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["requested_date", "request_state"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
          ],
        });

        res.json(requests);
        break;
      }
      case "pending": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: [
            "requested_date",
            "notes_symptoms",
            "date_of_service",
            "request_state",
          ],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "active": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: [
            "requested_date",
            "notes_symptoms",
            "date_of_service",
            "request_state",
          ],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "conclude": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["requested_date", "date_of_service", "request_state"],
          include: [
            {
              model: User,
              attributes: [
                "patient_id",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "toclose": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["date_of_service", "notes_symptoms", "request_state"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "dob",
                "address_1",
                "region",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["user_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      case "unpaid": {
        const requests = await RequestModel.findAll({
          where: { request_state: state },
          attributes: ["date_of_service", "request_state"],
          include: [
            {
              model: User,
              attributes: [
                "user_id",
                "firstname",
                "lastname",
                "mobile_no",
                "address_1",
              ],
              where: {
                region: region,
                type_of_user: "patient",
              },
            },
            {
              model: User,
              where: { role: "physician", type_of_user: "provider" },
              attributes: ["provider_id", "firstname", "lastname"],
            },
          ],
        });
        res.json(requests);
        break;
      }
      default: {
        res.status(500).json({ message: "Invalid State !!!" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Request Support */
export const request_support = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    await User.update(
      {
        support_message,
      },
      {
        where: {
          scheduled_status: "no" || null,
          type_of_user: "provider",
        },
      }
    );
    return res.status(200).json({
      status: true,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**Admin Profile */
export const admin_profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { admin_id } = req.params;

  try {
    const profile = await User.findOne({
      where: {
        user_id: admin_id,
      },
    });
    if (!profile) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ profile });
  } catch (error) {
    console.error("Error fetching Admin Profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**Admin Request Actions */

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
          model: User,
          attributes: [
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "business_name",
            "address_1",
            "region",
            "street",
            "city",
            "state",
            "zip",
          ],
          where: {
            type_of_user: "patient",
          },
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
    try {
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
    } catch {
      res
        .status(404)
        .json({ error: "Invalid State !!!" });
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
    const { firstname, lastname, dob, mobile_no, email } = req.body;
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
      const patient_data = await User.findOne({
        where: { user_id: request.user_id },
      });
      if (!patient_data) {
        return res.status(404).json({ error: "Patient not found" });
      }
      await User.update(
        {
          firstname,
          lastname,
          dob,
          mobile_no,
          email,
        },
        {
          where: {
            user_id: request.user_id,
            type_of_user: "patient",
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
      "pending" ||
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
      const physicians = await User.findAll({
        where: {
          type_of_user: "provider",
          region: region,
          role: "physician",
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
    const { mobile_no, email } = req.body;
    if (state === " pending") {
      const request = await RequestModel.findOne({
        where: {
          confirmation_no,
          block_status: "no",
          cancellation_status: "no",
          close_case_status: "no",
        },
        include: {
          model: User,
          attributes: ["email", "mobile_number"],
          where: {
            type_of_user: "patient",
          },
        },
      });
      if (!request) {
        return res.status(400).json({
          message: "Invalid request case",
          errormessage: statusCodes[400],
        });
      }
      const user = await User.findOne({
        where: { email, mobile_no, type_of_user: "patient" },
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
      const physicians = await User.findAll({
        where: {
          type_of_user: "provider",
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
      const provider = await User.findOne({
        where: {
          type_of_user: "provider",
          firstname,
          lastname,
          role: "physician",
        },
      });
      if (!provider) {
        return res.status(404).json({ error: "Provider not found" });
      }
      const physician_id = provider.user_id;
      await RequestModel.update(
        {
          user_id: physician_id,
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
