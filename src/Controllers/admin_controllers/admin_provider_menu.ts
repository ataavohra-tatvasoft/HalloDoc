import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Requestor from "../../db/models/requestor_2";
import Notes from "../../db/models/notes_2";
import Order from "../../db/models/order_2";
import Region from "../../db/models/region_2";
import Profession from "../../db/models/profession_2";
import statusCodes from "../../public/status_codes";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { Op } from "sequelize";
import Documents from "../../db/models/documents_2";
import dotenv from "dotenv";
import path, { dirname } from "path";
import fs from "fs";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Provider Menu                                    */
export const provider_list = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {region, page, pageSize } = req.query as { region: string ; page: string; pageSize: string;};
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit; 
    const providers = await User.findAll({
        attributes:["stop_notification_status","firstname", "lastname" , "role", "on_call_status", "status", ],
        where:{
            ...(region && { state: region }),
            type_of_user: "provider"
        }
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
