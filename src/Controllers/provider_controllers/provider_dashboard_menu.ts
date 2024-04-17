import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Business from "../../db/models/business-vendor";
import {
  Controller,
  FormattedResponse,
  VerifiedToken,
} from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";
import message_constants from "../../public/message_constants";
import Logs from "../../db/models/log";
import { string } from "joi";
import EncounterForm from "../../db/models/encounter_form";

/** Configs */
dotenv.config({ path: `.env` });

/**                              Provider in Dashboard                                       */

export const requests_by_request_state_provider: Controller = async (
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
    const provider_id = verified_token.user_id;

    const { state, search, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const where_clause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const user = await User.findOne({
      where: {
        user_id: provider_id,
        type_of_user: "physician",
      },
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: message_constants.PNF,
      });
    }

    const handle_request_state = async (
      additionalAttributes?: Array<string>
    ) => {
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };
      const { count, rows: requests } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          physician_id: user.user_id,
          ...(requestor ? { requested_by: requestor } : {}),
        },
        attributes: [
          "request_id",
          "request_state",
          "confirmation_no",
          "requested_by",
          "physician_id",
          "patient_id",
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
            where: where_clause_patient,
          },
          {
            model: Requestor,
            attributes: ["user_id", "first_name", "last_name"],
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
          confirmationNo: request.confirmation_no,
          requestor: request.requested_by,
          patient_data: {
            user_id: request.Patient.user_id,
            name: request.Patient.firstname + " " + request.Patient.lastname,
            phone: request.Patient.mobile_no,
            address:
              request.Patient.address_1 +
              " " +
              request.Patient.address_2 +
              " " +
              request.Patient.state,
            ...(state == "active"
              ? {
                  status: request.Patient.status,
                }
              : {}),
          },

          requestor_data: {
            user_id: request.Requestor?.user_id || null,
            first_name:
              request.Requestor?.first_name ||
              null + " " + request.Requestor?.last_name ||
              null,
            last_name: request.Requestor?.last_name || null,
          },
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
      case "conclude":
        return await handle_request_state();
      case "active":
        return await handle_request_state();
      default:
        return res.status(500).json({ message: message_constants.IS });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const provider_accept_request: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const { confirmation_no } = req.params;

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const provider_id = verified_token.user_id;

    const is_request = await RequestModel.findOne({
      where: {
        confirmation_no,
        request_state: "new",
        physician_id: provider_id,
      },
      attributes: ["request_id"],
    });

    if (!is_request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const request_update = await RequestModel.update(
      {
        request_state: "pending",
        request_status: "accepted",
      },
      {
        where: {
          confirmation_no,
          request_state: "new",
        },
      }
    );
    if (!request_update) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const transfer_request_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { description } = req.body;
    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const provider_id = verified_token.user_id;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        physician_id: provider_id,
        request_status: {
          [Op.notIn]: [
            "cancelled by admin",
            "cancelled by provider",
            "blocked",
            "clear",
          ],
        },
      },
      attributes: ["request_id"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    // const physician_id = provider.user_id;
    await RequestModel.update(
      {
        physician_id: null,
        request_state: "new",
        request_status: "unassigned",
      },
      {
        where: {
          confirmation_no: confirmation_no,
        },
      }
    );
    const physician = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });
    if (!physician) {
      return res.status(404).json({
        message: message_constants.PhNF,
      });
    }
    await Notes.create({
      request_id: request.request_id,
      physician_name: physician.firstname + " " + physician.lastname,
      description,
      type_of_note: "transfer_notes",
    });
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const view_notes_for_request_provider: Controller = async (
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
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const save_view_notes_for_request_provider: Controller = async (
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
        type_of_note: "physician_notes",
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
            type_of_note: "physician_notes",
          },
        }
      );
    } else {
      status = await Notes.create({
        request_id: request.request_id,
        type_of_note: "physician_notes",
        description: new_note,
      });
    }
    return res.status(200).json({
      status: true,
      confirmation_no: confirmation_no,
      message: "Successfull !!!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const active_state_encounter: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { type_of_care } = req.query as {
      [key: string]: string;
    };

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    if (type_of_care == "consult") {
      const update = await RequestModel.update(
        {
          request_state: "conclude",
          request_status: "conclude",
        },
        {
          where: {
            confirmation_no,
          },
        }
      );
      if (!update) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    if (type_of_care == "housecall") {
      const update = await RequestModel.update(
        {
          request_status: "md_on_site",
        },
        {
          where: {
            confirmation_no,
          },
        }
      );
      if (!update) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const housecall: Controller = async (
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
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const update = await RequestModel.update(
      {
        request_state: "conclude",
        request_status: "conclude",
      },
      {
        where: {
          confirmation_no,
        },
      }
    );
    if (!update) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_conclude_care_view: Controller = async (
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
        confirmation_no,
      },
      include: [
        {
          model: User,
          as: "Patient",
        },
      ],
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const notes = await Notes.findAll({
      where: {
        note_id: request.request_id,
        type_of_note: "physician_notes",
      },
    });

    if (!notes) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }

    const documents = await Documents.findAll({
      where: {
        request_id: request.request_id,
      },
    });

    if (!documents) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }
    const formatted_request = {
      confirmation_no: confirmation_no,
      patient_name: request.Patient.firstname + " " + request.Patient.lastname,
      documents: {
        documents: documents?.map((document) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
      physician_notes: {
        notes: notes?.map((note) => ({
          note_id: note.note_id,
          type_of_note: note.type_of_note,
          description: note.description,
        })),
      },
    };

    formatted_response.data.push(formatted_request);

    return res.status(500).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_conclude_care_upload: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    console.log(req.file?.fieldname);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("Uploaded file details:", req.file);
    const file = req.file;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }

    const new_document = await Documents.create({
      request_id: request.request_id,
      document_name: req.file?.fieldname,
      document_path: file.path,
    });
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

export const conclude_state_conclude_care: Controller = async (
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
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    // console.log(request);

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });

    if (!encounter_form) {
      return res.status(404).json({
        message: message_constants.EFoNF,
      });
    }

    if (encounter_form.is_finalize == "true") {
      const update = await RequestModel.update(
        {
          request_state: "toclose",
          request_status: "closed",
        },
        {
          where: {
            request_id: request.request_id,
            confirmation_no: request.confirmation_no,
          },
        }
      );

      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }

      return res.status(200).json({
        message: message_constants.Success,
      });
    } else {
      return res.status(500).json({
        message: message_constants.EFNF,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_encounter_form: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const {
      first_name,
      last_name,
      location,
      date_of_birth,
      date_of_service,
      phone_no,
      email,
      history_of_present,
      medical_history,
      medications,
      allergies,
      temperature,
      heart_rate,
      respiratory_rate,
      blood_pressure,
      o2,
      pain,
      heent,
      cv,
      chest,
      abd,
      extr,
      skin,
      neuro,
      other,
      diagnosis,
      treatment_plan,
      medication_dispensed,
      procedures,
      follow_up,
    } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    if (encounter_form) {
      const update = await EncounterForm.update(
        {
          request_id: request.request_id,
          first_name,
          last_name,
          location,
          date_of_birth,
          date_of_service,
          phone_no: BigInt(phone_no),
          email,
          history_of_present,
          medical_history,
          medications,
          allergies,
          temperature,
          heart_rate,
          respiratory_rate,
          blood_pressure,
          o2,
          pain,
          heent,
          cv,
          chest,
          abd,
          extr,
          skin,
          neuro,
          other,
          diagnosis,
          treatment_plan,
          medication_dispensed,
          procedures,
          follow_up,
        },
        {
          where: {
            request_id: request.request_id,
          },
        }
      );

      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }
    } else {
      const create = await EncounterForm.create({
        request_id: request.request_id,
        first_name,
        last_name,
        location,
        date_of_birth,
        date_of_service,
        phone_no,
        email,
        history_of_present,
        medical_history,
        medications,
        allergies,
        temperature,
        heart_rate,
        respiratory_rate,
        blood_pressure,
        o2,
        pain,
        heent,
        cv,
        chest,
        abd,
        extr,
        skin,
        neuro,
        other,
        diagnosis,
        treatment_plan,
        medication_dispensed,
        procedures,
        follow_up,
      });
      if (!create) {
        return res.status(500).json({
          message: message_constants.EWC,
        });
      }
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const conclude_state_encounter_form_finalize: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const { finalize_status } = req.body;
    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    if (encounter_form) {
      const update = await EncounterForm.update(
        {
          request_id: request.request_id,
          is_finalize: finalize_status,
        },
        {
          where: {
            request_id: request.request_id,
          },
        }
      );

      if (!update) {
        return res.status(404).json({
          message: message_constants.EWU,
        });
      }
    } else {
      return res.status(404).json({
        message: message_constants.FoNF,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
