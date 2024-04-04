import { Request, Response, NextFunction } from "express";
import { Controller, FormattedResponse } from "../../interfaces/common_interface";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import Business from "../../db/models/business-vendor";

/** Configs */
dotenv.config({ path: `.env` });

export const partner_vendor_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, profession, page, page_size } = req.query as {
      firstname: string;
      lastname: string;
      profession: string;
      page: string;
      page_size: string;
    };
    const page_number = parseInt(page) || 1;
    const limit = parseInt(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response:  FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count, rows: businesses } = await Business.findAndCountAll({
      attributes: [
        "business_id",
        "profession",
        "business_name",
        "email",
        "fax_number",
        "mobile_no",
        "business_contact",
      ],
      where: {
        ...(firstname && { firstname: firstname }),
        ...(lastname && { lastname: lastname }),
        ...(profession && { profession: profession }),
      },
    });
    if (!businesses) {
      return res.status(404).json({
        message: message_constants.BNF,
      });
    }
    var i = offset + 1;
    for (const business of businesses) {
      const formatted_request: any = {
        sr_no: i,
        business_id: business.business_id,
        profession: business.profession,
        business_name: business.business_name,
        email: business.email,
        fax_number: business.fax_number,
        mobile_no: business.mobile_no,
        business_contact: business.business_contact,
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

export const add_business: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      business_name,
      profession,
      fax_number,
      mobile_no,
      email,
      business_contact,
      street,
      city,
      state,
      zip,
    } = req.body as {
      business_name: string;
      profession: string;
      fax_number: number;
      mobile_no: number;
      email: string;
      business_contact: number;
      street: string;
      city: string;
      state: string;
      zip: number;
    };

    const status = await Business.create({
      business_name,
      profession,
      fax_number,
      mobile_no,
      email,
      business_contact,
      street,
      city,
      state,
      zip,
    });
    if (!status) {
      return res.status(400).json({
        message: message_constants.EWCB,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const update_business: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { business_id } = req.params;
    const is_business = await Business.findOne({
      where: {
        business_id,
      },
    });
    if (!is_business) {
      return res.status(400).json({
        message: message_constants.BNF,
      });
    }
    const {
      business_name,
      profession,
      fax_number,
      mobile_no,
      email,
      business_contact,
      street,
      city,
      state,
      zip,
    } = req.body as {
      business_name: string;
      profession: string;
      fax_number: number;
      mobile_no: number;
      email: string;
      business_contact: number;
      street: string;
      city: string;
      state: string;
      zip: number;
    };

    const status = await Business.update(
      {
        business_name,
        profession,
        fax_number,
        mobile_no,
        email,
        business_contact,
        street,
        city,
        state,
        zip,
      },
      {
        where: { business_id },
      }
    );
    if (!status) {
      return res.status(400).json({
        message: message_constants.EWUB,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const delete_vendor: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { business_id } = req.params;
    const is_business = await Business.findOne({
      where: {
        business_id,
      },
    });
    if (!is_business) {
      return res.status(400).json({
        message: message_constants.BNF,
      });
    }
    const status = await Business.destroy({
      where: {
        business_id,
      },
    });
    if (!status) {
      return res.status(400).json({
        message: message_constants.EWDB,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};
