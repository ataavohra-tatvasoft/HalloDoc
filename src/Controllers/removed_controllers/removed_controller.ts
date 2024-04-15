import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request";
import User from "../../db/models/user";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import {
  Controller,
  FormattedResponse,
  VerifiedToken,
} from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import Documents from "../../db/models/documents";
import message_constants from "../../public/message_constants";
import UserRegionMapping from "../../db/models/user-region_mapping";
import Role from "../../db/models/role";
import Region from "../../db/models/region";

/**Old API for request */
export const requests_by_request_state: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, firstname, lastname, region, requestor, page, page_size } =
      req.query as {
        [key: string]: string;
      };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const where_clause_patient = {
      type_of_user: "patient",
      ...(firstname && { firstname: { [Op.like]: `%${firstname}%` } }),
      ...(lastname && { lastname: { [Op.like]: `%${lastname}%` } }),
      ...(region && { state: region }),
    };

    switch (state) {
      case "new": {
        const formatted_response: FormattedResponse<any> = {
          status: true,
          data: [],
        };
        const { count: total_count, rows: requests } =
          await RequestModel.findAndCountAll({
            where: {
              request_status: {
                [Op.notIn]: [
                  "cancelled by admin",
                  "cancelled by provider",
                  "blocked",
                  "clear",
                ],
              },
              request_state: state,
              ...(requestor ? { requested_by: requestor } : {}),
            },
            attributes: [
              "request_id",
              "request_state",
              "confirmation_no",
              "requested_by",
              "requested_date",
              "patient_id",
            ],
            include: [
              {
                as: "Patient",
                model: User,
                attributes: [
                  "type_of_user",
                  "user_id",
                  "firstname",
                  "lastname",
                  "dob",
                  "mobile_no",
                  "address_1",
                  "address_2",
                ],
                where: where_clause_patient,
              },
              {
                model: Requestor,
                attributes: ["user_id", "first_name", "last_name"],
              },
              {
                model: Notes,
                attributes: ["note_id", "type_of_note", "description"],
              },
            ],
            limit,
            offset,
          });

        var i = offset + 1;
        for (const request of requests) {
          const formatted_request = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
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
      }
      case "pending":
      case "active": {
        const formatted_response: FormattedResponse<any> = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            request_status: {
              [Op.notIn]: [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
            },
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
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
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "physician",
              },
            },
            {
              model: Requestor,
              attributes: ["user_id", "first_name", "last_name"],
            },
            {
              model: Notes,
              attributes: ["note_id", "type_of_note", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formatted_request = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            requestor_data: {
              user_id: request.Requestor?.user_id || null,
              first_name:
                request.Requestor?.first_name ||
                null + " " + request.Requestor?.last_name ||
                null,
              last_name: request.Requestor?.last_name || null,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
          };
          i++;
          formatted_response.data.push(formatted_request);
        }

        return res.status(200).json({
          ...formatted_response,
          total_pages: Math.ceil(requests.count / limit),
          current_page: page_number,
          total_count: requests.count,
        });
      }
      case "conclude": {
        const formatted_response: FormattedResponse<any> = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            request_status: {
              [Op.notIn]: [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
            },
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
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
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formatted_request = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
          };
          i++;
          formatted_response.data.push(formatted_request);
        }

        return res.status(200).json({
          ...formatted_response,
          total_pages: Math.ceil(requests.count / limit),
          current_page: page_number,
          total_count: requests.count,
        });
      }
      case "toclose": {
        const formatted_response: FormattedResponse<any> = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            request_status: {
              [Op.notIn]: ["cancelled by provider", "blocked", "clear"],
            },
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_by",
            "requested_date",
            "date_of_service",
            "physician_id",
            "patient_id",
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
                "address_1",
                "state",
              ],
              where: where_clause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "firstname",
                "lastname",
                "dob",
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: {
                type_of_user: "physician",
              },
            },
            {
              model: Notes,
              attributes: ["note_id", "type_of_note", "description"],
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formatted_request = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob.toISOString().split("T")[0],
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
              region: request.Patient.state,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
              mobile_no: request.Physician.mobile_no,
              address:
                request.Physician.address_1 + " " + request.Physician.address_2,
            },
            notes: request.Notes?.map((note) => ({
              note_id: note.note_id,
              type_of_note: note.type_of_note,
              description: note.description,
            })),
          };
          i++;
          formatted_response.data.push(formatted_request);
        }

        return res.status(200).json({
          ...formatted_response,
          total_pages: Math.ceil(requests.count / limit),
          current_page: page_number,
          total_count: requests.count,
        });
      }
      case "unpaid": {
        const formatted_response: FormattedResponse<any> = {
          status: true,
          data: [],
        };
        const requests = await RequestModel.findAndCountAll({
          where: {
            request_status: {
              [Op.notIn]: [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
            },
            request_state: state,
            ...(requestor ? { requested_by: requestor } : {}),
          },
          attributes: [
            "request_id",
            "request_state",
            "confirmation_no",
            "requested_date",
            "requested_by",
            "date_of_service",
            "physician_id",
            "patient_id",
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
                "mobile_no",
                "address_1",
                "address_2",
              ],
              where: where_clause_patient,
            },
            {
              as: "Physician",
              model: User,
              attributes: [
                "user_id",
                "type_of_user",
                "dob",
                "firstname",
                "lastname",
              ],
              where: {
                type_of_user: "physician",
              },
            },
          ],
          limit,
          offset,
        });

        var i = offset + 1;
        for (const request of requests.rows) {
          const formatted_request = {
            sr_no: i,
            request_id: request.request_id,
            request_state: request.request_state,
            requestor: request.requested_by,
            confirmationNo: request.confirmation_no,
            requested_date: request.requested_date.toISOString().split("T")[0],
            date_of_service: request.date_of_service
              .toISOString()
              .split("T")[0],
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 + " " + request.Patient.address_2,
            },
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
              DOB: request.Physician.dob.toISOString().split("T")[0],
            },
          };
          i++;
          formatted_response.data.push(formatted_request);
        }

        return res.status(200).json({
          ...formatted_response,
          total_pages: Math.ceil(requests.count / limit),
          current_page: page_number,
          total_count: requests.count,
        });
        // return res.status(200).json({
        //   formatted_response,
        // });
      }
      default: {
        return res.status(500).json({ message: message_constants.IS });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

/** Admin MyProfileMenu*/
export const admin_profile_admin_info_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      user_id,
      firstname,
      lastname,
      email,
      mobile_no,
      district_of_columbia,
      new_york,
      virginia,
      maryland,
    } = req.body;
    // const { admin_id } = req.params;
    const admin_profile = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!admin_profile) {
      return res.status(404).json({ error: message_constants.ANF });
    }
    const update_status = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
      },
      {
        where: {
          user_id,
        },
      }
    );
    if (!update_status) {
      return res.status(500).json({ status: message_constants.EWU });
    }
    if (district_of_columbia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: admin_profile.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (new_york == true) {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: admin_profile.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (virginia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: admin_profile.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (maryland == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: admin_profile.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: admin_profile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: admin_profile.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    return res.status(200).json({ status: message_constants.US });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};` `
export const admin_profile_mailing_billling_info_edit: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {
        user_id,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      } = req.body;
      // const { admin_id } = req.params;
      const admin_profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!admin_profile) {
        return res.status(404).json({ error: message_constants.ANF });
      }
      const update_status = await User.update(
        {
          address_1,
          address_2,
          city,
          state,
          zip,
          billing_mobile_no,
        },
        {
          where: {
            user_id,
          },
        }
      );
      if (!update_status) {
        return res.status(200).json({ status: message_constants.EWU });
      }
      if (update_status) {
        return res.status(200).json({ status: message_constants.US });
      }
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

/**AdminProviderMenu */
/**Provider */

//Combined below four API into above one for API named save_user_information
export const save_account_information: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { user_id, username, status, role },
    } = req;

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    const is_role = await Role.findOne({
      where: {
        role_name: role,
      },
    });
    if (!is_role) {
      return res.status(500).json({
        message: message_constants.RoNF,
      });
    }
    const update_status = await User.update(
      { username, status, role_id: is_role.role_id },
      {
        where: {
          user_id,
        },
      }
    );
    if (update_status) {
      return res.status(200).json({
        message: message_constants.US,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const save_physician_information: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        user_id,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
        district_of_columbia,
        new_york,
        virginia,
        maryland,
      },
    } = req;

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    const update_status = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        synchronization_email,
      },
      {
        where: {
          user_id,
        },
      }
    );
    if (update_status) {
      return res.status(200).json({
        message: message_constants.US,
      });
    }
    if (district_of_columbia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (new_york == true) {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (virginia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (maryland == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const save_mailing_billing_info: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {
        user_id,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
      } = req.body;
      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
      }
      const updatestatus = await User.update(
        {
          address_1,
          address_2,
          city,
          state,
          zip,
          billing_mobile_no,
        },
        {
          where: {
            user_id,
          },
        }
      );
      if (updatestatus) {
        res.status(200).json({ status: message_constants.US });
      }
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};
export const save_provider_profile: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { user_id, business_name, business_website, admin_notes } =
        req.body;

      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
      }
      const updatestatus = await User.update(
        {
          admin_notes,
          business_name,
          business_website,
        },
        {
          where: {
            user_id,
            business_name,
            business_website,
          },
        }
      );
      if (updatestatus) {
        res.status(200).json({ status: message_constants.US });
      }
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};

export const create_provider_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: {
        username,
        password,
        role,
        firstname,
        lastname,
        email,
        mobile_no,
        medical_licence,
        NPI_no,
        district_of_columbia,
        new_york,
        virginia,
        maryland,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no,
        business_name,
        business_website,
        admin_notes,
      },
    } = req;

    const hashed_password: string = await bcrypt.hash(password, 10);
    const uploaded_files: any = req.files || [];

    const profile_picture_path = uploaded_files.find(
      (file: any) => file.fieldname === "profile_picture"
    )?.path;
    const independent_contractor_agreement_path = uploaded_files.find(
      (file: any) => file.fieldname === "independent_contractor_agreement"
    )?.path;
    const background_check_path = uploaded_files.find(
      (file: any) => file.fieldname === "background_check"
    )?.path;
    const HIPAA_path = uploaded_files.find(
      (file: any) => file.fieldname === "HIPAA"
    )?.path;
    const non_diclosure_path = uploaded_files.find(
      (file: any) => file.fieldname === "non_diclosure"
    )?.path;
    const is_role = await Role.findOne({
      where: {
        role_name: role,
      },
    });
    if (!is_role) {
      return res.status(500).json({
        message: message_constants.RoNF,
      });
    }
    const user = await User.create({
      type_of_user: "physician",
      username,
      password: hashed_password,
      role_id: is_role.role_id,
      firstname,
      lastname,
      email,
      mobile_no,
      medical_licence,
      NPI_no,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
      business_name,
      business_website,
      admin_notes,
      profile_picture: profile_picture_path,
    });

    if (!user) {
      return res.status(500).json({
        message: message_constants.EWCA,
      });
    }

    if (district_of_columbia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "District of Columbia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (new_york == true) {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "New York",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (virginia == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Virginia",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }
    if (maryland == true) {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });

      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: user.user_id,
              region_id: region?.region_id,
            },
          }
        );
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWU,
          });
        }
      } else {
        const mapping = await UserRegionMapping.create({
          user_id: user.user_id,
          region_id: region?.region_id,
        });
        if (!mapping) {
          return res.status(500).json({
            message: message_constants.EWC,
          });
        }
      }
    } else {
      const region = await Region.findOne({
        where: {
          region_name: "Maryland",
        },
        attributes: ["region_id"],
      });
      const is_exist = await UserRegionMapping.findOne({
        where: {
          user_id: user.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: user.user_id,
            region_id: region?.region_id,
          },
        });
        if (!delete_mapping) {
          return res.status(500).json({
            message: message_constants.EWD,
          });
        }
      }
    }

    if (independent_contractor_agreement_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user.user_id,
          document_name: "independent_contractor_agreement",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id: user.user_id,
          document_name: "independent_contractor_agreement",
          document_path: independent_contractor_agreement_path,
        });
      } else {
        await Documents.update(
          { document_path: independent_contractor_agreement_path },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );
      }
    }
    if (background_check_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user.user_id,
          document_name: "background_check",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id: user.user_id,
          document_name: "background_check",
          document_path: background_check_path,
        });
      } else {
        await Documents.update(
          { document_path: background_check_path },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );
      }
    }
    if (HIPAA_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user.user_id,
          document_name: "HIPAA",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id: user.user_id,
          document_name: "HIPAA",
          document_path: HIPAA_path,
        });
      } else {
        await Documents.update(
          { document_path: HIPAA_path },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );
      }
    }
    if (non_diclosure_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user.user_id,
          document_name: "non_diclosure",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id: user.user_id,
          document_name: "non_diclosure",
          document_path: non_diclosure_path,
        });
      } else {
        await Documents.update(
          { document_path: non_diclosure_path },
          {
            where: {
              user_id: user.user_id,
            },
          }
        );
      }
    }
    return res.status(200).json({
      message: message_constants.Success,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
