import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import {
  Controller,
  FormattedResponse,
} from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";
import Logs from "../../db/models/log";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "../../interfaces/common_interface";
import { generate_confirmation_number, transporter } from "../../utils/helper_functions";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Admin in Dashboard                                       */
/**Admin SignUp */
export const admin_signup: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        Email,
        Password,
        Status,
        Role_Id,
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
    const hashed_password: string = await bcrypt.hash(Password, 10);

    try {
      const admin_data = await User.create({
        type_of_user: "admin",
        email: Email,
        password: hashed_password,
        status: Status,
        role_id: Role_Id,
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
      if (admin_data) {
        return res.status(200).json({
          status: true,
          message: message_constants.SS,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        errormessage: "Already Signed-Up",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: message_constants.ISE + " " + error.message,
    });
  }
};

/**Admin Create Request */
export const admin_create_request: Controller = async (
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
    const type_of_user = verified_token.type_of_user;

    const {
      body: {
        firstname,
        lastname,
        phone_number,
        email,
        DOB,
        street,
        city,
        state,
        zip,
        room,
        admin_notes,
      },
    } = req;

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
      },
    });

    let patient_data;
    if (is_patient) {
      const update_status = await User.update(
        {
          firstname,
          lastname,
          mobile_no: phone_number,
          dob: new Date(DOB),
          street,
          city,
          state,
          zip,
          address_1: room,
        },
        {
          where: {
            type_of_user: "patient",
            email,
          },
        }
      );
      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      patient_data = is_patient;
    } else {
      patient_data = await User.create({
        type_of_user: "patient",
        firstname,
        lastname,
        mobile_no: phone_number,
        email,
        dob: new Date(DOB),
        street,
        city,
        state,
        zip,
        address_1: room,
      });

      if (!patient_data) {
        return res.status(400).json({
          status: false,
          message: message_constants.EWCA,
        });
      }
    }

    const todays_requests_count: number = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${new Date().toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${new Date().toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = generate_confirmation_number(
      patient_data.state,
      firstname,
      lastname,
      todays_requests_count
    );

    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: type_of_user,
      requested_date: new Date(),
      confirmation_no,
      street,
      city,
      state,
      zip,
    });

    if (!request_data) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCR,
      });
    }
    const admin_note = await Notes.create({
      request_id: request_data.request_id,
      description: admin_notes,
      type_of_note: "admin_notes",
    });

    if (!admin_note) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCN,
      });
    }

    return res.status(200).json({
      status: true,
      message: message_constants.RC,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.errormessage,
      message: message_constants.ISE,
    });
  }
};

export const admin_create_request_verify: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state } = req.body;

    const valid_states = [
      "District Of Columbia",
      "New York",
      "Virginia",
      "Maryland",
    ];

    if (!valid_states.includes(state)) {
      return res.status(404).json({ message: message_constants.ADBSA });
    }

    return res.status(200).json({ message: message_constants.AV });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      error: error.errormessage,
      message: message_constants.ISE,
    });
  }
};

/**
 * @function manage_requests_by_State
 * @param req - Express request object.
 * @param res - Express response object used to send the response.
 * @param next - Express next function to pass control to the next middleware.
 * @returns - Returns a Promise that resolves to an Express response object.
 * @throws - Throws an error if there's an issue in the execution of the function.
 * @description This function handles various actions related to requests based on their state.
 */
export const manage_requests_by_State: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, page_size } =
      req.query as {
        [key: string]: string;
      };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const where_clausePatient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    const handle_request_state = async (
      additionalAttributes?: Array<string>
    ) => {
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };
      const { count, rows: requests } = await RequestModel.findAndCountAll({
        where: {
          request_status: {
            [Op.notIn]: [
              "cancelled by admin",
              "cancelled by provider",
              "blocked",
              "clear",
            ],
          },
          request_state: state,
          ...(requestor ? { requested_by: requestor } : {}),
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "requested_by",
          "requested_date",
          "date_of_service",
          "physician_id",
          "patient_id",
          "street",
          "city",
          "state",
          "zip",
          ...(additionalAttributes || []),
        ],
        include: [
          {
            as: "Patient",
            model: User,
            attributes: [
              "user_id",
              "type_of_user",
              "firstname",
              "lastname",
              "dob",
              "mobile_no",
              "address_1",
              "state",
            ],
            where: where_clausePatient,
          },
          ...(state !== "new"
            ? [
                {
                  as: "Physician",
                  model: User,
                  attributes: [
                    "user_id",
                    "type_of_user",
                    "firstname",
                    "lastname",
                    "dob",
                    "mobile_no",
                    "address_1",
                    "address_2",
                  ],
                  where: {
                    type_of_user: "physician",
                  },
                },
              ]
            : []),
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
          },
          {
            model: Notes,
            attributes: ["note_id", "type_of_note", "description"],
          },
        ],
        limit,
        offset,
      });

      var i = offset + 1;
      for (const request of requests) {
        const formatted_request = {
          sr_no: i,
          request_id: request.request_id,
          request_state: request.request_state,
          confirmation_no: request.confirmation_no,
          requestor: request.requested_by,
          requested_date: request.requested_date.toISOString().split("T")[0],
          ...(state !== "new"
            ? {
                date_of_service: request.date_of_service
                  .toISOString()
                  .split("T")[0],
              }
            : {}),
          patient_data: {
            user_id: request.Patient.user_id,
            name: request.Patient.firstname + " " + request.Patient.lastname,
            DOB: request.Patient.dob.toISOString().split("T")[0],
            mobile_no: request.Patient.mobile_no,
            address:
              request?.street ||
              null + " " + request?.city ||
              null + " " + request?.state ||
              null,
            ...(state === "toclose" ? { region: request.Patient.state } : {}),
          },
          ...(state !== "new"
            ? {
                physician_data: {
                  user_id: request.Physician.user_id,
                  name:
                    request.Physician.firstname +
                    " " +
                    request.Physician.lastname,
                  DOB: request.Physician.dob.toISOString().split("T")[0],
                  mobile_no: request.Physician.mobile_no,
                  address:
                    request.Physician.address_1 +
                    " " +
                    request.Physician.address_2,
                },
              }
            : {}),
          requestor_data: {
            user_id: request.Requestor?.user_id || null,
            first_name:
              request.Requestor?.first_name ||
              null + " " + request.Requestor?.last_name ||
              null,
            last_name: request.Requestor?.last_name || null,
          },
          notes: request.Notes?.map((note) => ({
            note_id: note.note_id,
            type_of_note: note.type_of_note,
            description: note.description,
          })),
        };
        i++;
        formatted_response.data.push(formatted_request);
      }

      return res.status(200).json({
        ...formatted_response,
        total_pages: Math.ceil(count / limit),
        current_page: page_number,
        total_count: count,
      });
    };

    switch (state) {
      case "new":
      case "pending":
      case "active":
      case "conclude":
      case "toclose":
      case "unpaid":
        return await handle_request_state(
          state === "unpaid"
            ? ["date_of_service", "physician_id", "patient_id"]
            : undefined
        );
      default:
        return res.status(500).json({ message: message_constants.IS });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};
//Below two API's are combined in above API
export const requests_by_request_state_counts: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request_state = [
      "new",
      "pending",
      "active",
      "conclude",
      "toclose",
      "unpaid",
    ];
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    for (const state of request_state) {
      const { count } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          request_status: {
            [Op.notIn]:
              state === "toclose"
                ? ["cancelled by provider", "blocked", "clear"]
                : [
                    "cancelled by admin",
                    "cancelled by provider",
                    "blocked",
                    "clear",
                  ],
          },
        },
      });
      console.log(count);
      const formatted_request = {
        request_state: state,
        counts: count,
      };
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const requests_by_request_state_refactored: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    // const first_name = search.split(" ")[0];
    // const last_name = search.split(" ")[1];
    const where_clause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const handle_request_state = async (
      additionalAttributes?: Array<string>
    ) => {
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };
      const { rows: requests } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          ...(region && { state: region }),
          request_status: {
            [Op.notIn]:
              state === "toclose"
                ? ["cancelled by provider", "blocked", "clear"]
                : [
                    "cancelled by admin",
                    "cancelled by provider",
                    "blocked",
                    "clear",
                  ],
          },
          ...(requestor && { requested_by: requestor }),
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "requested_by",
          "requested_date",
          "date_of_service",
          "physician_id",
          "patient_id",
          "street",
          "city",
          "state",
          "zip",
          ...(additionalAttributes || []),
        ],
        include: [
          {
            as: "Patient",
            model: User,
            where: where_clause_patient,
          },
          ...(state !== "new"
            ? [
                {
                  as: "Physician",
                  model: User,
                  where: {
                    type_of_user: "physician",
                  },
                  required: false, // Make physician association optional
                },
              ]
            : []),
          {
            model: Requestor,
          },
          {
            model: Notes,
          },
        ],
        limit,
        offset,
      });

      const { count } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          ...(region && { state: region }),
          request_status: {
            [Op.notIn]:
              state === "toclose"
                ? ["cancelled by provider", "blocked", "clear"]
                : [
                    "cancelled by admin",
                    "cancelled by provider",
                    "blocked",
                    "clear",
                  ],
          },
          ...(requestor && { requested_by: requestor }),
        },
        include: [
          {
            as: "Patient",
            model: User,
            where: where_clause_patient,
          },
          ...(state !== "new"
            ? [
                {
                  as: "Physician",
                  model: User,
                  where: {
                    type_of_user: "physician",
                  },
                  required: false,
                },
              ]
            : []),
        ],
        limit,
        offset,
      });

      var i = offset + 1;
      for (const request of requests) {
        const formatted_request = {
          sr_no: i,
          request_id: request.request_id,
          request_state: request.request_state,
          confirmation_no: request.confirmation_no,
          requestor: request.requested_by,
          requested_date: request.requested_date?.toISOString().split("T")[0],
          ...(state !== "new"
            ? {
                date_of_service: request.date_of_service
                  ?.toISOString()
                  .split("T")[0],
              }
            : {}),
          patient_data: {
            user_id: request?.Patient?.user_id || null,
            name:
              request?.Patient?.firstname + " " + request?.Patient?.lastname,
            DOB: request?.Patient?.dob?.toISOString().split("T")[0],
            mobile_no: request?.Patient?.mobile_no || null,
            address:
              request?.street + " " + request?.city + " " + request?.state,
            ...(state === "toclose"
              ? { region: request?.Patient?.state || null }
              : {}),
          },
          ...(state !== "new"
            ? {
                physician_data: {
                  user_id: request?.Physician?.user_id || null,
                  name:
                    request?.Physician?.firstname +
                    " " +
                    request?.Physician?.lastname,
                  DOB:
                    request?.Physician?.dob?.toISOString().split("T")[0] ||
                    null,
                  mobile_no: request?.Physician?.mobile_no || null,
                  address:
                    request?.Physician?.address_1 ||
                    null + " " + request?.Physician?.address_2 ||
                    null + " " + request?.Physician?.state ||
                    null,
                },
              }
            : {}),
          requestor_data: {
            user_id: request?.Requestor?.user_id || null,
            first_name:
              request?.Requestor?.first_name ||
              null + " " + request?.Requestor?.last_name ||
              null,
            last_name: request?.Requestor?.last_name || null,
          },
          notes: request?.Notes?.map((note) => ({
            note_id: note?.note_id || null,
            type_of_note: note?.type_of_note || null,
            description: note?.description || null,
          })),
        };
        i++;
        formatted_response.data.push(formatted_request);
      }

      return res.status(200).json({
        ...formatted_response,
        total_pages: Math.ceil(count / limit),
        current_page: page_number,
        total_count: count,
      });
    };

    switch (state) {
      case "new":
        return await handle_request_state();
      case "pending":
      case "active":
      case "conclude":
        return await handle_request_state();
      case "toclose":
        return await handle_request_state();
      case "unpaid":
        return await handle_request_state([
          "date_of_service",
          "physician_id",
          "patient_id",
        ]);
      default:
        return res.status(500).json({ message: message_constants.IS });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

/**Admin Request Actions */

/**
 * @description Given below functions are Express controllers that allows viewing and saving notes for a request identified by the confirmation number.
 */
export const view_notes_for_request: Controller = async (
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
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const transfer_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "transfer_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const physician_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "physician_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const admin_notes_list = await Notes.findAll({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_notes",
      },
      attributes: ["request_id", "note_id", "description", "type_of_note"],
    });
    const formatted_request = {
      confirmation_no: confirmation_no,
      transfer_notes: {
        notes: transfer_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      physician_notes: {
        notes: physician_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
      admin_notes: {
        notes: admin_notes_list?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
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
export const save_view_notes_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { new_note } = req.body;
    var status;
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
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const notes_status = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_notes",
      },
    });
    if (notes_status) {
      status = await Notes.update(
        {
          description: new_note,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "admin_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        request_id: request.request_id,
        type_of_note: "admin_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below are Express controllers that allows canceling a case for a request identified by the confirmation number.
 */
export const cancel_case_for_request_view_data: Controller = async (
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
        request_state: "new",
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
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formatted_request = {
      confirmation_no: request.confirmation_no,
      patient_data: {
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
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
export const cancel_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason, additional_notes } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
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
    await RequestModel.update(
      {
        request_state: "toclose",
        request_status: "cancelled by admin",
      },
      {
        where: {
          request_id: request.request_id,
          confirmation_no: confirmation_no,
        },
      }
    );
    const notes_status = await Notes.findOne({
      where: {
        request_id: request.request_id,
        type_of_note: "admin_cancellation_notes",
      },
    });
    if (notes_status) {
      Notes.update(
        {
          description: additional_notes,
          reason: reason,
        },
        {
          where: {
            request_id: request.request_id,
            type_of_note: "admin_cancellation_notes",
          },
        }
      );
    } else {
      Notes.create({
        request_id: request.request_id,
        type_of_note: "admin_cancellation_notes",
        description: additional_notes,
        reason: reason,
      });
    }

    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows viewing and assigning requests to a physician.
 */
export const assign_request_region_physician: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { region } = req.query as {
      [key: string]: string;
    };
    var i = 1;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      confirmation_no: confirmation_no,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role_id", "firstname", "lastname"],
      where: {
        type_of_user: "physician",
        ...(region ? { state: region } : {}),
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: message_constants.PhNF,
      });
    }
    for (const physician of physicians) {
      const formatted_request = {
        sr_no: i,
        confirmation_no: confirmation_no,
        firstname: physician.firstname,
        lastname: physician.lastname,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const assign_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, assign_req_description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "physician",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: message_constants.PrNF });
    }
    const physician_id = provider.user_id;
    await RequestModel.update(
      {
        request_state: "new",
        request_status: "assigned",
        physician_id: physician_id,
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
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below are Express controllers that allows blocking a case for a request identified by the confirmation number and viewing the corresponding patient data.
 */
export const block_case_for_request_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      confirmation_no: confirmation_no,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
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
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const formatted_request = {
      confirmation_no: confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        firstname: request.Patient.firstname,
        lastname: request.Patient.lastname,
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
export const block_case_for_request_post: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { reason_for_block } = req.body;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "new",
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
    await RequestModel.update(
      {
        request_status: "blocked",
        block_reason: reason_for_block,
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "new",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows viewing and transfer request to a different physician.
 */
export const transfer_request_region_physicians: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const {confirmation_no} = req.params;
    const { region } = req.query as {
      [key: string]: string;
    };
    var i = 1;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      // confirmation_no: confirmation_no,
      data: [],
    };
    const physicians = await User.findAll({
      attributes: ["state", "role_id", "firstname", "lastname"],
      where: {
        type_of_user: "physician",
        ...(region ? { state: region } : {}),
      },
    });
    if (!physicians) {
      return res.status(200).json({
        status: false,
        message: message_constants.PhNF,
      });
    }
    for (const physician of physicians) {
      const formatted_request = {
        sr_no: i,
        // firstname: physician.firstname,
        // lastname: physician.lastname,
        physician_name: physician.firstname + " " + physician.lastname,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }
    return res.status(200).json({
      message: message_constants.Success,
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const transfer_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, description } = req.body;
    const provider = await User.findOne({
      where: {
        firstname,
        lastname,
        type_of_user: "physician",
      },
    });
    if (!provider) {
      return res.status(404).json({ error: message_constants.PrNF });
    }
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_status: {
          [Op.and]: [
            {
              [Op.notIn]: [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
            },
            // { [Op.eq]: "accepted" },
          ],
        },
      },
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    // const physician_id = provider.user_id;
    await RequestModel.update(
      {
        physician_id: provider.user_id,
        request_state: "new",
        request_status: "assigned",
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    await Notes.create({
      request_id: request.request_id,
      physician_name: firstname + " " + lastname,
      description,
      type_of_note: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Given below functions are Express controllers that allows clearing case/request.
 */
export const clear_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    try {
      const request = await RequestModel.findOne({
        where: { confirmation_no },
        attributes: ["confirmation_no", "request_id"],
      });
      if (!request) {
        return res.status(404).json({ error: message_constants.RNF });
      }
      await Notes.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      await Order.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      await Documents.destroy({
        where: {
          request_id: request.request_id,
        },
      });
      await RequestModel.update(
        {
          request_status: "clear",
        },
        {
          where: {
            confirmation_no: confirmation_no,
          },
        }
      );
      return res.status(200).json({
        status: true,
        confirmation_no: confirmation_no,
        message: message_constants.Success,
      });
    } catch {
      return res.status(404).json({ error: message_constants.IS });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description These functions handles various actions related to closing a case for a request, including viewing details, editing patient data, and downloading documents.
 */
export const close_case_for_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
        request_status: {
          [Op.notIn]: ["cancelled by provider", "blocked", "clear"],
        },
      },
      include: [
        {
          as: "Patient",
          model: User,
          attributes: ["firstname", "lastname", "dob", "mobile_no", "email"],
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    await RequestModel.update(
      {
        request_state: "unpaid",
        request_status: "closed",
      },
      {
        where: {
          confirmation_no: confirmation_no,
          request_state: "toclose",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const close_case_for_request_view_details: Controller = async (
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
        request_state: "toclose",
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
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "dob",
            "mobile_no",
            "email",
          ],
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
      attributes: ["request_id", "confirmation_no"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formatted_request = {
      request_id: request.request_id,
      confirmation_no: request.confirmation_no,
      patient_data: {
        user_id: request.Patient.user_id,
        first_name: request.Patient.firstname,
        last_name: request.Patient.lastname,
        DOB: request.Patient.dob.toISOString().split("T")[0],
        mobile_no: request.Patient.mobile_no,
        email: request.Patient.email,
        documents: request.Documents?.map((document) => ({
          document_id: document.document_id,
          document_path: document.document_path,
          upload_date: document.createdAt.toISOString().split("T")[0],
        })),
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
export const close_case_for_request_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { firstname, lastname, dob, mobile_no, email } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
        request_state: "toclose",
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
    const patient_data = await User.findOne({
      where: { user_id: request.patient_id },
    });
    if (!patient_data) {
      return res.status(404).json({ error: message_constants.PaNF });
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
          user_id: request.patient_id,
          type_of_user: "patient",
        },
      }
    );
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const close_case_for_request_actions_download: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no, document_id } = req.params;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_state: "toclose",
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
          attributes: ["request_id", "document_id", "document_path"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const document = await Documents.findOne({
      where: {
        request_id: request.request_id,
        document_id: document_id,
      },
    });

    if (!document) {
      return res.status(404).json({ error: message_constants.DNF });
    }

    let file_path = document.document_path;

    if (!path.isAbsolute(file_path)) {
      file_path = path.join(__dirname, "uploads", file_path);
    }

    if (!fs.existsSync(file_path)) {
      return res.status(404).json({ error: message_constants.FNF });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.document_path}"}`
    );

    res.download(file_path, (error) => {
      if (error) {
        res.status(500).json({ error: message_constants.ISE });
      } else {
        return res.status(200).json({
          status: true,
          confirmation_no: confirmation_no,
          message: message_constants.DoS,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**Admin Request Support */
/**
 * @description Given below functions are Express controllers that allows request support.
 */
export const request_support: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { support_message } = req.body;
    const users = await User.findAll({
      where: {
        on_call_status: "un-scheduled",
        type_of_user: "physician",
      },
    });
    if (!users) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }

    for (const user of users) {
      if (user.mobile_no) {
        const account_sid = process.env.TWILIO_ACCOUNT_SID;
        const auth_token = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(account_sid, auth_token);

        client.messages
          .create({
            body: `Message from admin to physicians . Link :- ${support_message}`,
            from: process.env.TWILIO_MOBILE_NO,
            // to: "+" + user.mobile_no,
            to: "+918401736963",
          })
          .then((message) => console.log(message.sid))
          .catch((error) => console.error(error));

        const SMS_log = await Logs.create({
          type_of_log: "SMS",
          // recipient: user.firstname + " " + user.lastname,
          recipient: user.firstname + " " + user.lastname,
          action: "For Sending Request Link",
          role_name: "Admin",
          // mobile_no: user.mobile_no,
          mobile_no: user.mobile_no,
          sent: "Yes",
        });
        if (!SMS_log) {
          return res.status(500).json({
            message: message_constants.EWCL,
          });
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: message_constants.Success,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};

/**Admin Send Link */
/**
 * @description Given below functions are Express controllers that allows sending link to create a request.
 */
export const admin_send_link: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, mobile_no, email } = req.body;
    const create_request_link = "https://localhost:3000/create_request";

    if (email) {
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

      const mail_content = `
        <html>
        <p>Given below is a create request link for patient</p>
        </br>
        </br>
        </br>
        <p> ${create_request_link}</p>
        </form>
        </html>
      `;

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Create Request Link",
        html: mail_content,
      });

      if (!info) {
        return res.status(500).json({
          message: message_constants.EWSL,
        });
      }
      const email_log = await Logs.create({
        type_of_log: "Email",
        // recipient: user.firstname + " " + user.lastname,
        recipient: firstname + " " + lastname,
        action: "For Sending Request Link",
        role_name: "Admin",
        // email: user.email,
        email: email,
        sent: "Yes",
      });

      if (!email_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }
    }

    if (mobile_no) {
      const account_sid = process.env.TWILIO_ACCOUNT_SID;
      const auth_token = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(account_sid, auth_token);

      client.messages
        .create({
          body: `Link for creating request for patient. Link :- ${create_request_link}`,
          from: process.env.TWILIO_MOBILE_NO,
          // to: "+" + mobile_no,
          to: "+918401736963",
        })
        .then((message) => console.log(message.sid))
        .catch((error) => console.error(error));

      const SMS_log = await Logs.create({
        type_of_log: "SMS",
        // recipient: user.firstname + " " + user.lastname,
        recipient: firstname + " " + lastname,
        action: "For Sending Request Link",
        role_name: "Admin",
        // mobile_no: user.mobile_no,
        mobile_no: mobile_no,
        sent: "Yes",
      });
      if (!SMS_log) {
        return res.status(500).json({
          message: message_constants.EWCL,
        });
      }
    }

    return res.status(200).json({
      status: true,
      message: message_constants.CRLS,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};
