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

/**                             Admin in Access Roles                                     */
/** Admin Account Access */
export const access_accountaccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const account = await User.findAll({
        where: {
          status: "active",
        },
        attributes: ["firstname", "lastname", "type_of_user"],
      });
      if (!account) {
        return res.status(404).json({ error: "Accounts not found" });
      }
      res.status(200).json({ account });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const access_accountaccess_edit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { admin_id } = req.params;
      const account = await User.findOne({
        where: {
          user_id: admin_id,
          status: "active",
        },
        attributes: [
          "firstname",
          "lastname",
          "mobile_no",
          "address_1",
          "address_2",
          "city",
          "state",
          "zip",
          "dob",
          "region",
          "type_of_user",
        ],
      });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.status(200).json({ account });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const access_accountaccess_edit_save = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { admin_id } = req.params;
      const {
        firstname,
        lastname,
        mobile_no,
        address_1,
        address_2,
        city,
        region,
        zip,
        dob,
      } = req.body;
      const account = await User.findOne({
        where: {
          user_id: admin_id,
          status: "active",
        },
      });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      const account_data = await User.update(
        {
          firstname,
          lastname,
          mobile_no,
          address_1,
          address_2,
          city,
          state: region,
          zip,
          dob,
        },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (!account_data) {
        return res.status(404).json({ error: "Error while editing information" });
      }
      return res.status(200).json({
        status: true,
        message: "Edited Successfully !!!",
      });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const access_accountaccess_delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { admin_id } = req.params;
      const account = await User.findOne({
        where: {
          user_id: admin_id,
          status: "active",
        },
      });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      const delete_account = await User.destroy({
        where: {
          user_id: admin_id,
        },
      });
      if (!delete_account) {
        return res.status(404).json({ error: "Error while deleting account" });
      }
      return res.status(200).json({
        status: true,
        message: "Deleted Successfully !!!",
      });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  /** Admin User Access */
export const access_useraccess = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { firstname, lastname } = req.query; // Get search parameters from query string
      const whereClause: { [key: string]: any } = {};
  
      if (firstname) {
        whereClause.firstname = {
          [Op.like]: `%${firstname}%`, // Use LIKE operator for partial matching
        };
      }
      if (lastname) {
        whereClause.lastname = {
          [Op.like]: `%${lastname}%`,
        };
      }
  
      const accounts = await User.findAll({
        attributes: [
          "firstname",
          "lastname",
          "type_of_user",
          "mobile_no",
          "status",
        ],
        where: whereClause, // Apply constructed search criteria
      });
  
      if (!accounts) {
        return res.status(404).json({ error: "No matching users found" });
      }
  
      res.status(200).json({ accounts });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const access_useraccess_edit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { admin_id } = req.params;
      const account = await User.findOne({
        where: {
          user_id: admin_id,
        },
        attributes: [
          "firstname",
          "lastname",
          "mobile_no",
          "address_1",
          "address_2",
          "city",
          "state",
          "zip",
          "dob",
          "region",
          "type_of_user",
          "status",
        ],
      });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.status(200).json({ account });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const access_useraccess_edit_save = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { admin_id } = req.params;
      const {
        firstname,
        lastname,
        mobile_no,
        address_1,
        address_2,
        city,
        region,
        zip,
        dob,
        type_of_user,
      } = req.body;
      const account = await User.findOne({
        where: {
          user_id: admin_id,
        },
      });
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      const account_data = await User.update(
        {
          firstname,
          lastname,
          mobile_no,
          address_1,
          address_2,
          city,
          state: region,
          zip,
          dob,
          type_of_user,
        },
        {
          where: {
            user_id: admin_id,
          },
        }
      );
      if (!account_data) {
        return res.status(404).json({ error: "Error while editing information" });
      }
      return res.status(200).json({
        status: true,
        message: "Edited Successfully !!!",
      });
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  