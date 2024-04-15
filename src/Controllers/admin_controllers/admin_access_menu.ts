import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user";
import {
  Controller,
  FormattedResponse,
} from "../../interfaces/common_interface";
import { Op } from "sequelize";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import RoleAccessMapping from "../../db/models/role-access_mapping";
import Access from "../../db/models/access";
import Role from "../../db/models/role";

/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Access Roles                                     */

/** Admin Account Access */
/**
 * Manages account access based on the specified action.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction object
 */
export const access_accountaccess: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, page_size } = req.query;
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const { count, rows: roles } = await Role.findAndCountAll({
      attributes: ["role_id", "role_name", "account_type"],
      limit,
      offset,
    });

    if (!roles) {
      return res.status(404).json({ error: message_constants.AcNF });
    }

    var i = offset + 1;
    for (const role of roles) {
      const formatted_request = {
        sr_no: i,
        role_id: role.role_id,
        name: role.role_name,
        account_type: role.account_type,
      };
      formatted_response.data.push(formatted_request);
      i++;
    }

    return res.status(200).json({
      ...formatted_response,
      total_pages: Math.ceil(count / limit),
      current_page: page_number,
      total_count: count
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_accountaccess_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };

    const is_role = await Role.findOne({
      where: {
        role_id,
      },
      include: [Access],
    });
    if (!is_role) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }

    const formatted_request = {
      role_id: is_role.role_id,
      role_name: is_role.role_name,
      account_type: is_role.account_type,
      accesses: is_role.Access?.map((access) => ({
        access_id: access.access_id,
        access_name: access.access_name,
      })),
    };

    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_accountaccess_edit_save: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;

    const { role_name, account_type, access_ids } = req.body as {
      role_name: string;
      account_type: string;
      access_ids: Array<number>;
    };

    const is_role = await Role.findOne({
      where: {
        role_id,
      },
      include: {
        model: Access,
      },
    });
    if (!is_role) {
      return res.status(404).json({
        message: message_constants.NF,
      });
    }

    const update_role = await Role.update(
      {
        role_name,
        account_type,
      },
      {
        where: {
          role_id,
        },
      }
    );
    if (!update_role) {
      return res.status(500).json({
        message: message_constants.EWU,
      });
    }

    if (access_ids) {
      for (const access of is_role.Access) {
        const delete_access = await RoleAccessMapping.destroy({
          where: {
            role_id,
            access_id: access.access_id,
          },
        });
        if (!delete_access) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }

      for (const access of access_ids) {
        const is_access = await Access.findOne({
          where: {
            access_id: access,
          },
        });
        if (!is_access) {
          return res.status(500).json({
            message: message_constants.NF,
          });
        }
        const create_access = RoleAccessMapping.create({
          role_id: is_role.role_id,
          access_id: access,
        });
        if (!create_access) {
          return res.status(500).json({
            message: message_constants.EWC + " for " + access,
          });
        }
      }
    }

    return res.status(200).json({
      message: message_constants.US,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_account_access_create_access: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_name, account_type, access_ids } = req.body as {
      role_name: string;
      account_type: string;
      access_ids: Array<number>;
    };

    const new_role = await Role.create({
      role_name,
      account_type,
    });

    if (!new_role) {
      return res.status(500).json({
        message: message_constants.EWCA,
      });
    }

    for (const access of access_ids) {
      const is_access = await Access.findOne({
        where: {
          access_id: access,
        },
      });
      if (!is_access) {
        return res.status(500).json({
          message: message_constants.NF,
        });
      }
      const create_access = RoleAccessMapping.create({
        role_id: new_role.role_id,
        access_id: access,
      });
      if (!create_access) {
        return res.status(500).json({
          message: message_constants.EWC + " for " + access,
        });
      }
    }

    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_account_access_delete: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id } = req.params;
    const role = await Role.findOne({
      where: {
        role_id,
      },
    });

    if (!role) {
      return res.status(404).json({ error: message_constants.RoNF });
    }

    const mapping = await RoleAccessMapping.destroy({
      where: { role_id },
    });

    if (!mapping) {
      return res.status(500).json({
        message: message_constants.EWD,
      });
    }

    const delete_role = await Role.destroy({
      where: {
        role_id,
      },
    });
    if (!delete_role) {
      return res.status(500).json({
        message: message_constants.EWD,
      });
    }
    return res
      .status(200)
      .json({ status: true, message: message_constants.DS });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

/** Admin User Access */
/**
 * Manages user access based on the specified action.
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param next Express NextFunction object
 */

export const access_useraccess: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, region } = req.query; // Get search parameters from query string
    const where_clause: { [key: string]: any } = {
      ...(region && { state: region }),
    };
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    if (role) {
      where_clause.role = {
        [Op.like]: `%${role}%`, // Use LIKE operator for partial matching
      };
    };
    const accounts = await User.findAll({
      attributes: [
        "role_id",
        "user_id",
        "type_of_user",
        "firstname",
        "lastname",
        "mobile_no",
        "status",
        "open_requests",
      ],
      where: where_clause, // Apply constructed search criteria
    });

    if (!accounts) {
      return res.status(404).json({ error: message_constants.ANF });
    }
    for (const account of accounts) {
      const formatted_request = {
        user_id: account.user_id,
        account_type: account.type_of_user,
        account_poc: account.firstname + " " + account.lastname,
        phone: account.mobile_no,
        status: account.status,
        open_requests: account.open_requests,
      };
      formatted_response.data.push(formatted_request);
    }
    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_useraccess_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const account = await User.findOne({
      where: {
        user_id: user_id,
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
        "type_of_user",
        "status",
        "role_id",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const formatted_request = {
      firstname: account.firstname,
      lastname: account.lastname,
      phone: account.mobile_no,
      address_1: account.address_1,
      address_2: account.address_2,
      city: account.city,
      region: account.state,
      zip: account.zip,
      DOB: account.dob,
      account_type: account.type_of_user,
      status: account.status,
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const access_useraccess_edit_save: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
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
        user_id: user_id,
      },
    });
    if (!account) {
      return res.status(404).json({ error: message_constants.ANF });
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
          user_id: user_id,
        },
      }
    );
    if (!account_data) {
      return res.status(404).json({ error: message_constants.EWEA });
    }
    return res.status(200).json({
      status: true,
      message: message_constants.US,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
