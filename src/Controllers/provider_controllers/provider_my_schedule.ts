import { Request, Response, NextFunction } from "express";
import {
  Controller,
  FormattedResponse,
} from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import dotenv from "dotenv";
import Shifts from "../../db/models/shifts";
import { DATE, Op } from "sequelize";
import { VerifiedToken } from "../../interfaces/common_interface";
import jwt from "jsonwebtoken";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Scheduling Menu                                    */

export const provider_provider_shifts_list: Controller = async (
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

    const { page, page_size } = req.query;
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const { count, rows: shifts } = await Shifts.findAndCountAll({
      where: {
        user_id: provider_id,
      },
    });

    var i = offset + 1;
    for (const shift of shifts) {
      const formatted_request = {
        sr_no: i,
        shift_id: shift.shift_id,
        user_id: shift.user_id,
        region: shift.region,
        status: shift.status,
        shift_date: shift.shift_date.toISOString().split("T")[0],
        shift_month: shift.shift_date.getMonth() + 1,
        start: shift.start,
        end: shift.end,
        repeat_days: shift.repeat_days,
        repeat_end: shift.repeat_end,
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
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const provider_create_shift: Controller = async (
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

    const { region, shift_date, start, end, repeat_days, repeat_end } =
      req.body;

    const date = new DATE(shift_date);

    const user = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });
    if (!user) {
      return res.status(500).json({
        message: message_constants.PhNF,
      });
    }
    const shift = await Shifts.create({
      user_id: user.user_id,
      region,
      physician: user.firstname + " " + user.lastname,
      shift_date,
      start,
      end,
      repeat_days,
      repeat_end,
    });

    if (!shift) {
      return res.status(500).json({
        message: message_constants.EWCS,
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

export const provider_view_shift: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shift_id } = req.query;
    const numeric_shift_id = Number(shift_id);

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const shift = await Shifts.findOne({
      where: {
        shift_id: numeric_shift_id,
      },
      attributes: [
        "shift_id",
        "region",
        "physician",
        "shift_date",
        "start",
        "end",
      ],
    });

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF,
      });
    }
    const formatted_request = {
      shift_id: shift.shift_id,
      region: shift.region,
      physician: shift.physician,
      shift_date: shift.shift_date.toISOString().split("T")[0],
      start: shift.start,
      end: shift.end,
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const provider_edit_shift: Controller = async (
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
    const { shift_id, region, shift_date, start, end } = req.body;
    const numeric_shift_id = Number(shift_id);
    const provider_id = verified_token.user_id;

    const shift = await Shifts.findOne({
      where: {
        shift_id: numeric_shift_id,
      },
      attributes: ["region", "physician", "shift_date", "start", "end"],
    });

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF,
      });
    }

    const user = await User.findOne({
      where: {
        user_id: provider_id,
      },
    });
    if (!user) {
      return res.status(500).json({
        message: message_constants.PhNF,
      });
    }

    const update_shift = await Shifts.update(
      {
        user_id: user.user_id,
        region,
        physician: user.firstname + " " + user.lastname,
        shift_date,
        start,
        end,
      },
      {
        where: {
          shift_id,
        },
      }
    );

    if (!update_shift) {
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
