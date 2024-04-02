import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Order from "../../db/models/order";
import Business from "../../db/models/business-vendor";
import { Controller } from "../../interfaces/common_interface";
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
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    const provider_id = verifiedToken.user_id;

    const { state, search, requestor, page, page_size } = req.query as {
      state: string;
      search: string;
      requestor: string;
      page: string;
      page_size: string;
    };
    const page_number = parseInt(page) || 1;
    const limit = parseInt(page_size) || 10;
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

    const handle_request_state = async (additionalAttributes?: any) => {
      const formatted_response: any = {
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
        const formatted_request: any = {
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
        totalPages: Math.ceil(count / limit),
        currentPage: page_number,
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
    const { confirmation_no } = req.params;

    const is_request = await RequestModel.findOne({
      where: {
        confirmation_no,
      },
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
