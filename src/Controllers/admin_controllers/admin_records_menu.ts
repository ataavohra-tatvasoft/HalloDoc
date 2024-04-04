import { Request, Response, NextFunction } from "express";
import {
  Controller,
  FormattedResponse,
} from "../../interfaces/common_interface";
import dotenv from "dotenv";
import { Op } from "sequelize";
import message_constants from "../../public/message_constants";
import User from "../../db/models/user";
import RequestModel from "../../db/models/request";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Documents from "../../db/models/documents";
import Logs from "../../db/models/log";


/** Configs */
dotenv.config({ path: `.env` });

export const patient_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, email, phone_no, page, page_size } = req.query;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const where_clause_patient = {
      type_of_user: "patient",
      ...(firstname && {
        firstname: { [Op.like]: `%${firstname}%` },
      }),
      ...(lastname && {
        lastname: { [Op.like]: `%${lastname}%` },
      }),
      ...(email && { email: { [Op.eq]: email } }),
      ...(phone_no && { mobile_no: { [Op.eq]: phone_no } }),
    };

    const { count, rows: users } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "type_of_user",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "address_1",
        "address_2",
        "state",
      ],
      where: where_clause_patient,
      limit,
      offset,
    });
    if (!users) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }
    var i = offset + 1;
    for (const user of users) {
      const formatted_request: any = {
        sr_no: i,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.mobile_no,
        address: user.address_1 + " " + user.address_2 + " " + user.state,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(count / limit),
      currentPage: page_number,
      total_count: count,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const patient_records: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, page_size } = req.query;
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count, rows: requests } = await RequestModel.findAndCountAll({
      attributes: [
        "request_id",
        "confirmation_no",
        "createdAt",
        "concluded_date",
        "request_status",
        "final_report",
      ],
      include: [
        {
          model: User,
          as: "Patient",
          attributes: ["user_id", "firstname", "lastname"],
        },
        {
          model: User,
          as: "Physician",
          attributes: ["user_id", "firstname", "lastname"],
        },
      ],
      limit,
      offset,
    });
    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }
    var i = offset + 1;
    for (const request of requests) {
      const formatted_request: any = {
        sr_no: i,
        client_member:
          request.Patient?.firstname + " " + request.Patient?.lastname,
        created_at: request.createdAt,
        confirmation_no: request.confirmation_no,
        provider_name:
          request.Physician?.firstname + " " + request.Physician?.lastname,
        concluded_date: request?.concluded_date,
        status: request.request_status,
        final_report: request?.final_report,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(count / limit),
      currentPage: page_number,
      total_count: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const patient_records_view_documents: Controller = async (
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

    const formatted_request: any = {
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

export const patient_records_view_case: Controller = async (
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
        },
        {
          model: Notes,
          attributes: ["request_id", "note_id", "description", "type_of_note"],
          where: {
            type_of_note: "patient_notes",
          },
        },
      ],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formatted_request: any = {
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

export const search_records: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      request_status,
      patient_name,
      request_type,
      from_date_of_service,
      to_date_of_service,
      provider_name,
      email,
      phone_no,
      page,
      page_size,
    } = req.query;

    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const where_clause = {
      ...(request_type && {
        request_state: { [Op.like]: `%${request_type}%` },
      }),
      ...(from_date_of_service && {
        date_of_service: { [Op.gte]: from_date_of_service }, // Use Op.gte for greater than or equal
      }),
      ...(to_date_of_service && {
        date_of_service: { [Op.lte]: to_date_of_service }, // Use Op.lte for less than or equal
      }),
      ...(request_status && {
        request_status: { [Op.like]: `%${request_status}%` },
      }),
      // ... potentially add other WhereOptions properties
    };

    const { count: total_count, rows: requests } =
      await RequestModel.findAndCountAll({
        attributes: [
          "request_id",
          "confirmation_no",
          "requested_by",
          "date_of_service",
          "closed_date",
          "request_state",
          "request_status",
        ],
        where: where_clause,
        include: [
          {
            model: User,
            as: "Patient",
            attributes: [
              "user_id",
              "firstname",
              "lastname",
              "email",
              "mobile_no",
              "address_1",
              "address_2",
              "zip",
            ],
            where: {
              ...(patient_name && {
                [Op.or]: [
                  { firstname: { [Op.like]: `%${patient_name}%` } },
                  { lastname: { [Op.like]: `%${patient_name}%` } },
                ],
              }),
              ...(email && {
                email: { [Op.like]: `%${email}%` },
              }),
              ...(phone_no && {
                mobile_no: { [Op.like]: `%${phone_no}%` },
              }),
            },
          },
          {
            model: User,
            as: "Physician",
            attributes: ["user_id", "firstname", "lastname"],
            where: {
              ...(provider_name && {
                [Op.or]: [
                  { firstname: { [Op.like]: `%${provider_name}%` } },
                  { lastname: { [Op.like]: `%${provider_name}%` } },
                ],
              }),
            },
          },
          {
            model: Notes,
            attributes: ["note_id", "type_of_note", "description"],
          },
        ],
        limit,
        offset,
      });
    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }
    var i: any = offset + 1;
    for (const request of requests) {
      const formatted_request: any = {
        sr_no: i,
        request_id: request.request_id,
        confirmation_no: request.confirmation_no,
        patient_name:
          request.Patient.firstname + " " + request.Patient.lastname,
        requestor: request.requested_by,
        date_of_service: request.date_of_service
          ? request.date_of_service.toISOString().split("T")[0]
          : null,
        closed_date: request.closed_date
          ? request.closed_date.toISOString().split("T")[0]
          : null,
        email: request.Patient.email,
        phone_no: request.Patient.mobile_no,
        address:
          request.Patient.address_1 +
          " " +
          request.Patient.address_2 +
          " " +
          request.Patient.state,
        zip: request.Patient.zip,
        request_status: request.request_status,
        physician:
          request.Physician.firstname + " " + request.Physician.lastname,
        notes: request.Notes?.map((note: any) => ({
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
      totalPages: Math.ceil(total_count / limit),
      currentPage: page_number,
      total_count: total_count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const search_record_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

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
    await RequestModel.destroy({
      where: {
        confirmation_no: confirmation_no,
      },
    });
    await Documents.destroy({
      where: {
        request_id: request.request_id,
      },
    });
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

export const logs_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      type_of_log,
      search_by_role,
      receiver_name,
      email_id,
      mobile_no,
      created_date,
      sent_date,
      page,
      page_size,
    } = req.query as {
      [key: string]: string;
      sent_date: any;
      created_date: any;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count: total_count, rows: logs } = await Logs.findAndCountAll({
      attributes: [
        "log_id",
        "type_of_log",
        "recipient",
        "action",
        "role_name",
        "email",
        "mobile_no",
        "createdAt",
        "sent",
      ],
      where: {
        type_of_log,
        ...(search_by_role && {
          role_name: { [Op.like]: `%${search_by_role}%` },
        }),
        ...(receiver_name && {
          recipient: { [Op.like]: `%${receiver_name}%` },
        }),
        ...(email_id && {
          email: { [Op.like]: `%${email_id}%` },
        }),
        ...(mobile_no && {
          mobile_no: { [Op.like]: `%${mobile_no}%` },
        }),
        ...(created_date && {
          createdAt: { [Op.like]: `%${created_date}%` },
        }),
        ...(sent_date && {
          createdAt: { [Op.like]: `%${sent_date}%` },
        }),
      },
      limit,
      offset,
    });
    if (!logs) {
      return res.status(404).json({
        message: message_constants.LNF,
      });
    }
    var i = offset + 1;
    for (const log of logs) {
      const formatted_request: any = {
        sr_no: i,
        recipient: log.recipient,
        action: log.action,
        role_name: log.role_name,
        email_id: log.email,
        created_date: log.createdAt.toISOString().split("T")[0],
        sent_date: log.createdAt.toISOString().split("T")[0],
        sent: log.sent,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(total_count / limit),
      currentPage: page_number,
      total_count: total_count,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const cancel_and_block_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type_of_history, name, date, email, phone_no, page, page_size } =
      req.query as {
        [key: string]: string;
        date: any;
      };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count: total_count, rows: requests } =
      await RequestModel.findAndCountAll({
        attributes: [
          "request_id",
          "confirmation_no",
          "patient_id",
          "physician_id",
          "createdAt",
          "updatedAt",
        ],
        where: {
          ...(date && {
            updatedAt: { [Op.like]: `%${date}%` },
          }),
          request_status: { [Op.like]: `%${type_of_history}%` }, //cancelled or blocked only
        },
        include: [
          {
            model: User,
            as: "Patient",
            attributes: [
              "user_id",
              "firstname",
              "lastname",
              "email",
              "mobile_no",
              "status",
            ],
            where: {
              ...(name && {
                [Op.or]: [
                  { firstname: { [Op.like]: `%${name}%` } },
                  { lastname: { [Op.like]: `%${name}%` } },
                ],
              }),
              ...(email && {
                email: { [Op.like]: `%${email}%` },
              }),
              ...(phone_no && {
                mobile_no: { [Op.like]: `%${phone_no}%` },
              }),
            },
          },
          {
            model: Notes,
            as: "Notes",
            attributes: ["note_id", "type_of_note", "description"],
          },
        ],

        limit,
        offset,
      });
    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }
    var i = offset + 1;
    for (const request of requests) {
      const formatted_request: any = {
        sr_no: i,
        type_of_history: request.request_status,
        request_confirmation_no: request.confirmation_no,
        patient_name:
          request.Patient.firstname + " " + request.Patient.lastname,
        phone: request.Patient.mobile_no,
        email: request.Patient.email,
        modified_date: request.updatedAt,
        created_date: request.updatedAt,
        is_active: request.Patient.status,
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
      totalPages: Math.ceil(total_count / limit),
      currentPage: page_number,
      total_count: total_count,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const block_history_unblock: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

    const request = RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });
    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }
    const update_status = RequestModel.update(
      {
        request_status: "new",
        block_reason: null,
      },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update_status) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};
