import Region from "../../db/models/region";
import Profession from "../../db/models/profession";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import * as exceljs from "exceljs";
import axios from "axios";
import * as fs from "fs";
import * as xlsx from "xlsx";
import path from "path";
import RequestModel from "../../db/models/request";
import Role from "../../db/models/role";
import ExcelJS from 'exceljs';


/** Regions API */

export const region_with_thirdparty_API: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var headers = new Headers();
    headers.append("X-CSCAPI-KEY", "API_KEY");

    fetch("https://api.countrystatecity.in/v1/states", {
      method: "GET",
      headers: headers,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        const states = result;
        res.status(200).json({
          status: "Successful",
          data: states,
        });
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};
export const region_for_request_states: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const regions = await User.findAll({
      // attributes: [Sequelize.fn('DISTINCT', Sequelize.col('state'))],
      attributes: ["state"],
      where: {
        type_of_user: "patient",
      },
    });

    if (!regions) {
      return res.status(404).json({ error: message_constants.EFRD });
    }
    const uniqueRegions = [...new Set(regions.map((region) => region.state))];

    for (const region of uniqueRegions) {
      const formattedRequest: any = {
        region_name: region,
      };
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const transfer_request_regions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const regions = await User.findAll({
      // attributes: [Sequelize.fn('DISTINCT', Sequelize.col('state'))],
      attributes: ["state"],
    });

    if (!regions) {
      return res.status(404).json({ error: message_constants.EFRD });
    }
    const uniqueRegions = [...new Set(regions.map((region) => region.state))];

    for (const region of uniqueRegions) {
      const formattedRequest: any = {
        region_name: region,
      };
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const regions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const regions = await Region.findAll({
      attributes: ["region_id", "region_name"],
    });

    if (!regions) {
      return res.status(404).json({ error: message_constants.EFRD });
    }
    for (const region of regions) {
      const formattedRequest: any = {
        region_name: region.region_name,
      };
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
/** Professions API */

export const professions_for_send_orders: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const professions = await User.findAll({
      attributes: ["profession"],
      where: {
        type_of_user: "vendor",
      },
    });
    if (!professions) {
      res.status(500).json({ error: message_constants.EFPD });
    }
    return res
      .status(200)
      .json({ status: "Successfull", professions: professions });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
export const professions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const professions = await Profession.findAll({
        attributes: ["profession_id", "profession_name"],
      });

      if (!professions) {
        return res.status(404).json({ error: message_constants.EFPD });
      }
      for (const profession of professions) {
        const formattedRequest: any = {
          profession_name: profession.profession_name,
        };
        formattedResponse.data.push(formattedRequest);
      }
      return res.status(200).json({
        ...formattedResponse,
      });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

/**Exports API */

export const export_one: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const token = req.headers.authorization;
      console.log(token);
      const { search, region, requestor, state } = req.query as {
        search: string;
        region: string;
        requestor: string;
        state: string;
      };
      const get_patient_requests = async (
        search?: string,
        region?: string,
        requestor?: string,
        state?: string
      ): Promise<any> => {
        const response = await axios.get(
          "http://localhost:7000/admin/dashboard/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              search,
              region,
              requestor,
              state,
            },
          }
        );
        console.log(response);
        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch patient requests: ${response.statusText}`
          );
        }
        const data = await response.data;
        return data;
      };

      const create_export_excel = async (requests: any[]): Promise<any> => {
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(requests);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Patient Requests");

        const buffer = xlsx.write(workbook, {
          bookType: "xlsx",
          type: "binary",
        });
        const filePath = path.join(
          __dirname,
          "public",
          "uploads",
          "patient_requests.xlsx"
        );

        // Create the directory if it doesn't exist (optional)
        fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Create directories recursively

        fs.writeFileSync(filePath, buffer, "binary");
        console.log("Excel file created successfully:", filePath);
      };
      const requests = await get_patient_requests(
        search,
        region,
        requestor,
        state
      );
      create_export_excel(requests);
      return res.json({ message: "Excel file exported successfully!" });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};
export const export_two: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, search, region, requestor, page, pageSize } = req.query as {
      state: string;
      search: string;
      region: string;
      requestor: string;
      page: string;
      pageSize: string;
    };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(region && { state: region }),
    };

    const handleRequestState = async (additionalAttributes?: any) => {
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const { count, rows: requests } = await RequestModel.findAndCountAll({
        where: {
          request_state: state,
          ...(state == "toclose"
            ? {
                request_status: {
                  [Op.notIn]: ["cancelled by provider", "blocked", "clear"],
                },
              }
            : {
                request_status: {
                  [Op.notIn]: [
                    "cancelled by admin",
                    "cancelled by provider",
                    "blocked",
                    "clear",
                  ],
                },
              }),
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
          ...(additionalAttributes || []),
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
            where: whereClause_patient,
          },
          ...(state !== "new"
            ? [
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
              ]
            : []),
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
        const formattedRequest: any = {
          sr_no: i,
          request_id: request.request_id,
          request_state: request.request_state,
          confirmationNo: request.confirmation_no,
          requestor: request.requested_by,
          requested_date: request.requested_date?.toISOString().split("T")[0],
          ...(state !== "new"
            ? {
                date_of_service: request.date_of_service
                  ?.toISOString()
                  .split("T")[0],
              }
            : {}),
          patient_data: {
            user_id: request.Patient.user_id,
            name: request.Patient.firstname + " " + request.Patient.lastname,
            DOB: request.Patient.dob?.toISOString().split("T")[0],
            mobile_no: request.Patient.mobile_no,
            address:
              request.Patient.address_1 +
              " " +
              request.Patient.address_2 +
              " " +
              request.Patient.state,
            ...(state === "toclose" ? { region: request.Patient.state } : {}),
          },
          ...(state !== "new"
            ? {
                physician_data: {
                  user_id: request.Physician.user_id,
                  name:
                    request.Physician.firstname +
                    " " +
                    request.Physician.lastname,
                  DOB: request.Physician.dob?.toISOString().split("T")[0],
                  mobile_no: request.Physician.mobile_no,
                  address:
                    request.Physician.address_1 +
                    " " +
                    request.Physician.address_2 +
                    " " +
                    request.Patient.state,
                },
              }
            : {}),
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
        formattedResponse.data.push(formattedRequest);
      }

      return formattedResponse;
    };

    let formattedResponse = null;

    switch (state) {
      case "new":
        formattedResponse = await handleRequestState();
        break;
      case "pending":
      case "active":
      case "conclude":
        formattedResponse = await handleRequestState();
        break;
      case "toclose":
        formattedResponse = await handleRequestState();
        break;
      case "unpaid":
        formattedResponse = await handleRequestState([
          "date_of_service",
          "physician_id",
          "patient_id",
        ]);
        break;
      default:
        return res.status(500).json({ message: message_constants.IS });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Requests');

    // Define headers for the Excel sheet
    const headers = [
      'SR No',
      'Request ID',
      'Request State',
      'Confirmation No',
      'Requestor',
      'Requested Date',
      'Date of Service',
      // Add more headers as needed
    ];

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // Add data to the worksheet
    for (const request of formattedResponse.data) {
      const rowData = [
        request.sr_no,
        request.request_id,
        request.request_state,
        request.confirmationNo,
        request.requestor,
        request.requested_date,
        request.date_of_service,
        // Add more data fields as needed
      ];
      worksheet.addRow(rowData);
    }

    // Generate a unique filename for the Excel file
    const filename = `requests_${state}_${new Date().toISOString()}.xlsx`;

    // Set the response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    return res.end();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};
export const export_three_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, region, requestor, page, pageSize } = req.query as {
      search: string;
      region: string;
      requestor: string;
      page: string;
      pageSize: string;
    };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;

    const whereClause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(region && { state: region }),
    };

    const states = ["new", "pending", "active", "conclude", "toclose", "unpaid"];

    const workbook = new ExcelJS.Workbook();

    for (const state of states) {
      const handleRequestState = async (additionalAttributes?: any) => {
        const formattedResponse: any = {
          status: true,
          data: [],
        };
        const { count, rows: requests } = await RequestModel.findAndCountAll({
          where: {
            request_state: state,
            ...(state == "toclose"
              ? {
                  request_status: {
                    [Op.notIn]: ["cancelled by provider", "blocked", "clear"],
                  },
                }
              : {
                  request_status: {
                    [Op.notIn]: [
                      "cancelled by admin",
                      "cancelled by provider",
                      "blocked",
                      "clear",
                    ],
                  },
                }),
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
            ...(additionalAttributes || []),
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
              where: whereClause_patient,
            },
            ...(state !== "new"
              ? [
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
                ]
              : []),
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

        for (const request of requests) {
          const formattedRequest: any = {
            request_id: request.request_id,
            request_state: request.request_state,
            confirmationNo: request.confirmation_no,
            requestor: request.requested_by,
            requested_date: request.requested_date?.toISOString().split("T")[0],
            ...(state !== "new"
              ? {
                  date_of_service: request.date_of_service
                    ?.toISOString()
                    .split("T")[0],
                }
              : {}),
            patient_data: {
              user_id: request.Patient.user_id,
              name: request.Patient.firstname + " " + request.Patient.lastname,
              DOB: request.Patient.dob?.toISOString().split("T")[0],
              mobile_no: request.Patient.mobile_no,
              address:
                request.Patient.address_1 +
                " " +
                request.Patient.address_2 +
                " " +
                request.Patient.state,
              ...(state === "toclose" ? { region: request.Patient.state } : {}),
            },
            ...(state !== "new"
              ? {
                  physician_data: {
                    user_id: request.Physician.user_id,
                    name:
                      request.Physician.firstname +
                      " " +
                      request.Physician.lastname,
                    DOB: request.Physician.dob?.toISOString().split("T")[0],
                    mobile_no: request.Physician.mobile_no,
                    address:
                      request.Physician.address_1 +
                      " " +
                      request.Physician.address_2 +
                      " " +
                      request.Patient.state,
                  },
                }
              : {}),
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
          formattedResponse.data.push(formattedRequest);
        }

        return formattedResponse;
      };

      const formattedResponse = await handleRequestState();

      // Create a new worksheet for each state
      const worksheet = workbook.addWorksheet(state);

      // Define headers for the Excel sheet
      const headers = [
        'Request ID',
        'Request State',
        'Confirmation No',
        'Requestor',
        'Requested Date',
        'Date of Service',
        // Add more headers as needed
      ];

      // Add headers to the worksheet
      worksheet.addRow(headers);

      // Add data to the worksheet
      for (const request of formattedResponse.data) {
        const rowData = [
          request.request_id,
          request.request_state,
          request.confirmationNo,
          request.requestor,
          request.requested_date,
          request.date_of_service,
          // Add more data fields as needed
        ];
        worksheet.addRow(rowData);
      }
    }

    // Generate a unique filename for the Excel file
    const filename = `requests_${new Date().toISOString()}.xlsx`;

    // Set the response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write the workbook to the response
    await workbook.xlsx.write(res);

    return res.end();

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

/**Action's API */
export const actions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { confirmation_no } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const request = await RequestModel.findOne({
      where: {
        confirmation_no: confirmation_no,
      },
      attributes: ["request_id", "request_state", "confirmation_no"],
    });
    if (!request) {
      return res.status(404).json({ error: message_constants.RNF });
    }
    const formattedRequest: any = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**Physician's API */
export const physicians: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const physicians = await User.findAll({
        attributes: ["firstname", "lastname", "type_of_user", "role"],
        where: {
          type_of_user: "physician",
        },
      });

      if (!physicians) {
        return res.status(404).json({ error: message_constants.EFPD });
      }
      for (const physician of physicians) {
        const formattedRequest: any = {
          physician_name: physician.firstname + " " + physician.lastname,
        };
        formattedResponse.data.push(formattedRequest);
      }
      return res.status(200).json({
        ...formattedResponse,
      });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

/**Role's API */
export const roles: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const {account_type} = req.params;
      const formattedResponse: any = {
        status: true,
        data: [],
      };
      const roles = await Role.findAll({
        attributes: ["role_id", "role_name"],
        where: {
          account_type,
        },
      });

      if (!roles) {
        return res.status(404).json({ error: message_constants.EFPD });
      }
      for (const role of roles) {
        const formattedRequest: any = {
          role_id: role.role_id ,
          role_name: role.role_name
        };
        formattedResponse.data.push(formattedRequest);
      }
      return res.status(200).json({
        ...formattedResponse,
      });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};