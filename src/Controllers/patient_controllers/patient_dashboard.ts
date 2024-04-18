import { FormattedResponse } from "../../interfaces/common_interface";
import Documents from "../../db/models/documents";
import { Request, Response, NextFunction } from "express";
import { Controller, VerifiedToken } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import jwt from "jsonwebtoken";
import RequestModel from "../../db/models/request";
import Region from "../../db/models/region";
import Profession from "../../db/models/profession";
import Role from "../../db/models/role";
import ExcelJS from "exceljs";
import { Op } from "sequelize";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Access from "../../db/models/access";
import JSZip from "jszip";
import bcrypt from "bcrypt";
import { request } from "http";
import { SsmlEmphasis } from "twilio/lib/twiml/VoiceResponse";
import { Format } from "archiver";

export const medical_history: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const patient_id = verified_token.user_id;

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const { count, rows: requests } = await RequestModel.findAndCountAll({
      where: {
        patient_id: patient_id,
      },
    });

    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    var i = offset + 1;

    for (const request of requests) {
      const documents = await Documents.findAll({
        where: {
          request_id: request.request_id,
        },
      });

      const formatted_request = {
        sr_no: i,
        request_id: request.request_id,
        confirmation_no: request.confirmation_no,
        created_date: request.createdAt?.toISOString().split("T")[0],
        request_state: request.request_state,
        request_status: request.request_status,
        documents: documents.map((document) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const request_document: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;

    const { authorization } = req.headers as { authorization: string };

    const token: string = authorization.split(" ")[1];
    const verified_token = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as VerifiedToken;
    const patient_id = verified_token.user_id;

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const patient = await User.findOne({
      where: {
        user_id: patient_id,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }

    const documents = await Documents.findAll({
      where: {
        request_id: request.request_id,
      },
    });

    if (!documents) {
      return res.status(404).json({
        message: message_constants.DNF,
      });
    }

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const formatted_request = {
      patient_name: patient.firstname + " " + patient.lastname,
      confirmation_no: request.confirmation_no,
      documents: documents.map((document) => ({
        document_id: document?.document_id || null,
        uploader: document?.uploader || null,
        document_name: document?.document_name || null,
        docuement_path: document?.document_path || null,
      })),
    };

    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
