import { Request, Response, NextFunction } from "express";
import { Controller, FormattedResponse } from "../../../interfaces/common_interface";
import User from "../../../db/models/user";
import message_constants from "../../../public/message_constants";
import dotenv from "dotenv";
import Shifts from "../../../db/models/shifts";
import { DATE, Op } from "sequelize";
import { start } from "repl";
import Role from "../../../db/models/role";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Scheduling Menu                                    */

export const provider_shifts_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, type_of_shift, page, page_size } = req.query as {
      region: string;
      type_of_shift: string;
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
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "firstname",
        "lastname",
        "type_of_user",
        "role_id",
        "status",
        "on_call_status",
      ],
      where: {
        type_of_user: "physician",
        on_call_status: "yes",
      },
      include: [
        {
          model: Shifts,
          as: "Shifts",
          attributes: [
            "shift_id",
            "user_id",
            "region",
            "status",
            "shift_date",
            "start",
            "end",
            "repeat_end",
            "repeat_days",
          ],
          where: {
            region: region,
          },
        },
      ],
    });
    var i = offset + 1;
    for (const provider of providers) {
      const is_role = await Role.findOne({
        where:{
          role_id: provider.role_id
        }
      });
      if(!is_role){
        return res.status(500).json({
          message:message_constants.RoNF
        })
      }
      const formatted_request: any = {
        sr_no: i,
        user_id: provider.user_id,
        provider_name: provider.firstname + " " + provider.lastname,
        type_of_user: provider.type_of_user,
        status: provider.status,
        shifts: provider.Shifts?.map((shift) => ({
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
        })),
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
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const provider_on_call: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, page_size } = req.query as {
      page: string;
      page_size: string;
    };
    const page_number = parseInt(page) || 1;
    const limit = parseInt(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response: any = {
      status: true,
      provider_on_call: [],
      provider_off_duty: [],
    };
    const { count, rows: providers_on_call } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "firstname",
        "lastname",
        "type_of_user",
        "role_id",
        "status",
        "on_call_status",
      ],
      where: {
        type_of_user: "physician",
      },
    });
    var i = offset + 1;
    for (const provider of providers_on_call) {
      if (provider.on_call_status == "yes") {
        const formatted_request_1: any = {
          sr_no: i,
          user_id: provider.user_id,
          provider_name: provider.firstname + " " + provider.lastname,
          type_of_user:
            provider.type_of_user,
          status: provider.status,
          on_call_status: provider.on_call_status,
        };
        formatted_response.provider_on_call.push(formatted_request_1);
      } else {
        const formatted_request_2: any = {
          sr_no: i,
          user_id: provider.user_id,
          provider_name: provider.firstname + " " + provider.lastname,
          type_of_user:
            provider.type_of_user,
          status: provider.status,
          on_call_status: provider.on_call_status + " i.e NO",
        };
        formatted_response.provider_off_duty.push(formatted_request_2);
      }
      i++;
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(count / limit),
      currentPage: page_number,
      total_count: count,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const requested_shifts: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, view_current_month_shift, page, page_size } = req.query as {
      region: string;
      view_current_month_shift: string;
      page: string;
      page_size: string;
    };
    function get_current_month(): [number, number] {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // Months are zero-indexed (January is 0)
      return [year, month + 1]; // Return year and month (1-indexed)
    }

    const [currentYear, currentMonth] = get_current_month();
    const page_number = parseInt(page) || 1;
    const limit = parseInt(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const formatted_response:  FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: ["user_id", "firstname", "lastname", "type_of_user", "role_id"],
      where: {
        type_of_user: "physician",
        on_call_status: "yes",
      },
      include: [
        {
          model: Shifts,
          as: "Shifts",
          attributes: [
            "shift_id",
            "user_id",
            "region",
            "status",
            "shift_date",
            "start",
            "end",
            "repeat_end",
            "repeat_days",
          ],
          where: {
            region: region,
            ...(view_current_month_shift && {
              [Op.and]: [
                {
                  // Assuming 'shift_date' is your date column
                  shift_date: {
                    [Op.gte]: `${currentYear}-${currentMonth}-01`, // Start of current month
                  },
                },
                {
                  shift_date: {
                    [Op.lte]: `${currentYear}-${currentMonth}-${new Date(
                      currentYear,
                      currentMonth,
                      0
                    ).getDate()}`, // End of current month (considering leap years)
                  },
                },
              ],
            }),
          },
        },
      ],
    });
    var i = offset + 1;
    for (const provider of providers) {
      const formatted_request_1: any = {
        sr_no: i,
        user_id: provider.user_id,
        staff: provider.firstname + " " + provider.lastname,
        shifts: provider.Shifts?.map((shift) => ({
          shift_id: shift.shift_id,
          user_id: shift.user_id,
          region: shift.region,
          status: shift.status,
          shift_date: shift.shift_date.toISOString().split("T")[0],
          time: shift.start + " - " + shift.end,
        })),
        // type_of_user:
        //   provider.type_of_user + "and subtype: " + provider.role,
        // status: provider.status,
        // on_call_status: provider.on_call_status,
      };
      formatted_response.data.push(formatted_request_1);
      i++;
    }

    return res.status(200).json({
      ...formatted_response,
      totalPages: Math.ceil(count / limit),
      currentPage: page_number,
      total_count: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const approve_selected: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shift_id } = req.query as {
      shift_id: string;
    };

    const shifts = Shifts.update(
      {
        status: "approved",
      },
      {
        where: {
          shift_id,
        },
      }
    );

    if (!shifts) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const delete_selected: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shift_id } = req.query as {
      shift_id: string;
    };

    const shifts = Shifts.destroy({
      where: {
        shift_id,
      },
    });
    if (!shifts) {
      return res.status(500).json({
        message: message_constants.EWD,
      });
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const create_shift: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      region,
      physician,
      shift_date,
      start,
      end,
      repeat_days,
      repeat_end,
    } = req.body as {
      region: string;
      physician: string;
      shift_date: any;
      start: any;
      end: any;
      repeat_days: any;
      repeat_end: any;
    };
    console.log(physician);
    const firstname = physician.split(" ")[0];
    const lastname = physician.split(" ")[1];
    const date = new DATE(shift_date);
    console.log(date);
    const user = await User.findOne({
      where: {
        firstname,
        lastname,
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
      physician,
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

export const view_shift: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shift_id } = req.query as {
      shift_id: string;
    };
    const formatted_response:  FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const shift = await Shifts.findOne({
      where: {
        shift_id,
      },
      attributes: ["region", "physician", "shift_date", "start", "end"],
    });

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF,
      });
    }
    const formatted_request_1: any = {
      region: shift.region,
      physician: shift.physician,
      shift_date: shift.shift_date.toISOString().split("T")[0],
      start: shift.start,
      end: shift.end,
    };
    formatted_response.data.push(formatted_request_1);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};
