import { Request, Response, NextFunction } from "express";
import { Controller } from "../../interfaces/common_interface";
import dotenv from "dotenv";
import { Op } from "sequelize";
import message_constants from "../../public/message_constants";
import User from "../../db/models/user_2";
import RequestModel from "../../db/models/request_2";
import Notes from "../../db/models/notes_2";
import Logs from "../../db/models/log_2";
import { request } from "http";

/** Configs */
dotenv.config({ path: `.env` });

export const patient_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, email, phone_no, page, pageSize } =
      req.query as {
        firstname: string;
        lastname: string;
        email: string;
        phone_no: any;
        page: string;
        pageSize: string;
      };
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      role: "patient",
      ...(firstname && {
        firstname: { [Op.like]: `%${firstname}%` },
      }),
      ...(lastname && {
        lastname: { [Op.like]: `%${lastname}%` },
      }),
      ...(email && { email: email }),
      ...(phone_no && { mobile_no: phone_no }),
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
      where: whereClause_patient,
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
      const formattedRequest: any = {
        sr_no: i,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.mobile_no,
        address: user.address_1 + " " + user.address_2 + " " + user.state,
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

export const patient_records: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, pageSize } = req.query as {
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
      const formattedRequest: any = {
        sr_no: i,
        client_member:
          request.Patient.firstname + " " + request.Patient.lastname,
        created_at: request.createdAt,
        confirmation_no: request.confirmation_no,
        provider_name:
          request.Physician.firstname + " " + request.Physician.lastname,
        concluded_date: request.concluded_date,
        status: request.request_status,
        final_report: request.final_report,
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
      pageSize,
    } = req.query as {
      request_status: string;
      patient_name: string;
      request_type: string;
      from_date_of_service: any;
      to_date_of_service: any;
      provider_name: string;
      email: string;
      phone_no: any;
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
    const { count, rows: requests } = await RequestModel.findAndCountAll({
      attributes: [
        "request_id",
        "confirmation_no",
        "requested_by",
        "date_of_service",
        "closed_date",
        "request_state",
        "request_status",
      ],
      where: {
        ...(request_type && {
          request_state: { [Op.like]: `%${request_type}%` },
        }),
        ...(from_date_of_service && {
          date_of_service: { [Op.like]: `%${from_date_of_service}%` },
        }),
        ...(to_date_of_service && {
          date_of_service: { [Op.like]: `%${from_date_of_service}%` },
        }),
        ...(request_status && {
          request_status: { [Op.like]: `%${request_status}%` },
        }),
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
      const formattedRequest: any = {
        sr_no: i,
        request_id: request.request_id,
        confirmation_no: request.confirmation_no,
        patient_name:
          request.Patient.firstname + " " + request.Patient.lastname,
        requestor: request.requested_by,
        date_of_service: request.date_of_service.toISOString().split("T")[0],
        closed_date: request.closed_date.toISOString().split("T")[0],
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
        notes: request.Notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
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

export const search_record_delete: Controller = async (
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
      const delete_status = RequestModel.destroy(
        {
          where: {
            confirmation_no,
          },
        }
      );
      if (!delete_status) {
        return res.status(500).json({
          message: message_constants.EWD,
        });
      }
    } catch (error) {
      res.status(500).json({ message: message_constants.ISE });
    }
  };

export const logs_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search_by_role,
      receiver_name,
      email_id,
      mobile_no,
      created_date,
      sent_date,
      page,
      pageSize,
    } = req.query as {
      search_by_role: string;
      receiver_name: string;
      email_id: string;
      mobile_no: any;
      created_date: any;
      sent_date: any;
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
    const { count, rows: logs } = await Logs.findAndCountAll({
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
      const formattedRequest: any = {
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

export const cancel_and_block_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type_of_history, name, date, email, phone_no, page, pageSize } =
      req.query as {
        type_of_history: string;
        name: string;
        date: any;
        email: string;
        phone_no: any;
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
    const { count, rows: requests } = await RequestModel.findAndCountAll({
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
        request_state: { [Op.like]: `%${type_of_history}%` }, //cancelled or blocked only
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
            [Op.or]: {
              ...(name && {
                firstname: { [Op.like]: `%${name}%` },
              }),
              ...(name && {
                lastname: { [Op.like]: `%${name}%` },
              }),
            },
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
      const formattedRequest: any = {
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
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

