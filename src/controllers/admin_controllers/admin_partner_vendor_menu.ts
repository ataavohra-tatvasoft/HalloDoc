import { Request, Response, NextFunction } from "express";
import { Op, WhereOptions } from "sequelize";
import message_constants from "../../constants/message_constants";
import {
  Controller,
  FormattedResponse,
  BusinessAttributes,
} from "../../interfaces";
import { Business } from "../../db/models";

export const partner_vendor_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { vendor, profession, region, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const where_clause: WhereOptions<BusinessAttributes> = {
      ...(vendor && {
        [Op.or]: [{ business_name: { [Op.like]: `%${vendor}%` } }],
      }),
      ...(profession && { profession }),
      ...(region && { state: region }),
    };

    const { count: total_count, rows: businesses } =
      await Business.findAndCountAll({
        attributes: [
          "business_id",
          "profession",
          "business_name",
          "email",
          "fax_number",
          "mobile_no",
          "business_contact",
        ],
        where: where_clause,
      });
    if (!businesses) {
      return res.status(404).json({
        message: message_constants.BNF,
      });
    }
    var i = offset + 1;
    for (const business of businesses) {
      const formatted_request = {
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
      total_pages: Math.ceil(total_count / limit),
      current_page: page_number,
      total_count: total_count,
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
    } = req.body;

    await Business.create({
      business_name,
      profession,
      fax_number,
      mobile_no: BigInt(mobile_no),
      email,
      business_contact: BigInt(business_contact),
      street,
      city,
      state,
      zip: Number(zip),
    });

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: message_constants.EWCB + " " + error.message });
  }
};

export const update_business_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { business_id } = req.params as {
      [key: string]: string;
    };

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const business = await Business.findOne({
      where: {
        business_id,
      },
    });

    const formatted_request = {
      business_id: business?.business_id,
      business_name: business?.business_name,
      profession: business?.profession,
      fax_number: business?.fax_number,
      phone_no: business?.mobile_no,
      email: business?.email,
      business_contact: business?.business_contact,
      street: business?.street,
      city: business?.city,
      state: business?.state,
      zip: business?.zip,
    };

    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: message_constants.EWCB + " " + error.message });
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
    } = req.body;

    const status = await Business.update(
      {
        business_name,
        profession,
        fax_number,
        mobile_no: BigInt(mobile_no),
        email,
        business_contact: BigInt(business_contact),
        street,
        city,
        state,
        zip: Number(zip),
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
    return res.status(500).json({ message: message_constants.ISE });
  }
};
