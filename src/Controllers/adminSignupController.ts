import dotenv from "dotenv";
import Admin from "../Models/admin";
import { Request,Response,NextFunction } from "express";
import bcrypt from "bcrypt";
import statusCodes from "../public/statusCodes";
dotenv.config({ path: `.env` });

export const adminSignup = async (req: Request, res: Response, next: NextFunction) => {
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
        },
      } = req;
  const hashedPassword: string = await bcrypt.hash(Password, 10);
  try {
    const adminData = await Admin.create({
        email:Email,
        password: hashedPassword,
        status:Status,
        role:Role,
        firstname:FirstName,
        lastname:LastName,
        mobile_no:MobileNumber,
        zip:Zip,
        billing_mobile_no:Billing_MobileNumber,
        address_1:Address_1,
        address_2:Address_2,
        city:City,
        state:State,
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
  } catch (error:any) {
    res.status(500).json({
      status: false,
      errormessage: "Internal server error" + error.message,
      message: statusCodes[500],
    });
  }
};