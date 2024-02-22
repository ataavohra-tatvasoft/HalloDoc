import Joi, { Schema } from "joi";
import { Request, Response, NextFunction } from "express";
import statusCodes from "../public/statusCodes";

// interface AdminSchemaSignUpRequest {
//   body: {
//     Email: string;
//     Confirm_Email: string;
//     Password: string;
//     Confirm_Password: string;
//     Status: string;
//     Role: string;
//     FirstName: string;
//     LastName: string;
//     MobileNumber: string;
//     Zip: string;
//     Billing_MobileNumber: string;
//     Address_1: string;
//     Address_2: string;
//     City: string;
//     State: string;
//   };
// }
export const adminSchemaSignUp = async (
  //   req: AdminSchemaSignUpRequest,
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
    },
  } = req;
  const adminSchema: Schema = Joi.object({
    Email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com"] },
    }),
    Confirm_Email: Joi.ref("Email"),
    Password: Joi.string().alphanum().min(5).required(),
    Confirm_Password: Joi.ref("Password"),
    Status: Joi.string().valid("Active", "In-Active"),
    Role: Joi.string().valid("Admin"),
    FirstName: Joi.string().max(8).min(3),
    LastName: Joi.string().max(8).min(3),
    MobileNumber: Joi.number().max(10).min(10),
    Zip: Joi.number().min(6).max(6),
    Billing_MobileNumber: Joi.number().max(10).min(10),
    Address_1: Joi.string().max(15).min(10),
    Address_2: Joi.string().max(15).min(10),
    City: Joi.string().valid(
      "Ahmedabad",
      "Amreli district",
      "Anand",
      "Banaskantha",
      "Bharuch",
      "Bhavnagar",
      "Dahod",
      "The Dangs",
      "Gandhinagar",
      "Jamnagar",
      "Junagadh",
      "Kutch",
      "Kheda",
      "Mehsana",
      "Narmada",
      "Navsari",
      "Patan",
      "Panchmahal",
      "Porbandar",
      "Rajkot",
      "Sabarkantha",
      "Surendranagar",
      "Surat",
      "Vyara",
      "Vadodara",
      "Valsad"
    ),
    State: Joi.string().valid(
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttarakhand",
      "Uttar Pradesh",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Delhi",
      "Lakshadweep",
      "Puducherry"
    ),
  });
  try {
    await adminSchema.validateAsync(
      {
        Email: Email,
        Confirm_Email: Confirm_Email,
        Password: Password,
        Confirm_Password: Confirm_Password,
        Status: Status,
        Role: Role,
        FirstName: FirstName,
        LastName: LastName,
        MobileNumber: MobileNumber,
        Zip: Zip,
        Billing_MobileNumber: Billing_MobileNumber,
        Address_1: Address_1,
        Address_2: Address_2,
        City: City,
        State: State,
      },
      { abortEarly: false, presence: "required" }
    );
    next();
  } catch (error: any) {
    // throw new Error(error.details.map((detail) => detail.message).join(", "));
    // console.log(error.details.map((detail) => detail.message).join(", "));
    // console.log(error.message);
    return res.status(500).json({
      status: false,
      errormessage: error.message,
      message: statusCodes[500],
    });
  }
};
