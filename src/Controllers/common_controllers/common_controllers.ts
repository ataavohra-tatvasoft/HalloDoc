import Region from "../../db/models/region";
import Profession from "../../db/models/profession";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import RequestModel from "../../db/models/request";
import Role from "../../db/models/role";
import ExcelJS from "exceljs";
import { Op } from "sequelize";
import Requestor from "../../db/models/requestor";
import Notes from "../../db/models/notes";
import Access from "../../db/models/access";
import JSZip from "jszip";
import { FormattedResponse } from "../../interfaces/common_interface";

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
    const formatted_response: FormattedResponse<any> = {
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
    const unique_regions = [...new Set(regions.map((region) => region.state))];

    for (const region of unique_regions) {
      const formatted_request = {
        region_name: region,
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
export const transfer_request_regions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const regions = await User.findAll({
      attributes: ["state"],
    });

    if (!regions) {
      return res.status(404).json({ error: message_constants.EFRD });
    }
    const unique_regions = [...new Set(regions.map((region) => region.state))];

    for (const region of unique_regions) {
      const formatted_request = {
        region_name: region,
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
export const regions: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // type FormattedRequest = { region_name: string };
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const regions = await Region.findAll({
      attributes: ["region_id", "region_name"],
    });

    if (!regions) {
      return res.status(404).json({ error: message_constants.EFRD });
    }

    formatted_response.data = regions.map((each) => ({
      region_name: each.region_name,
    }));

    // for (const region of regions) {
    //   const formatted_request: FormattedRequest = {
    //     region_name: region.region_name,
    //   };
    //   formatted_response.data.push(formatted_request);
    // }

    return res.status(200).json({
      ...formatted_response,
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
      const formatted_response: FormattedResponse<any> = {
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
        const formatted_request = {
          profession_name: profession.profession_name,
        };
        formatted_response.data.push(formatted_request);
      }
      return res.status(200).json({
        ...formatted_response,
      });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

/**Exports API */

export const export_single: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state, search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;

    const where_clause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(region && { state: region }),
    };

    const handle_request_state = async (additional_attributes?: any) => {
      const formatted_response: FormattedResponse<any> = {
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
          ...(additional_attributes || []),
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
        const formatted_request = {
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
        formatted_response.data.push(formatted_request);
      }

      return formatted_response;
    };

    let formatted_response = null;

    switch (state) {
      case "new":
        formatted_response = await handle_request_state();
        break;
      case "pending":
      case "active":
      case "conclude":
        formatted_response = await handle_request_state();
        break;
      case "toclose":
        formatted_response = await handle_request_state();
        break;
      case "unpaid":
        formatted_response = await handle_request_state([
          "date_of_service",
          "physician_id",
          "patient_id",
        ]);
        break;
      default:
        return res.status(500).json({ message: message_constants.IS });
    }

    // Create a new Excel work_book and worksheet
    const work_book = new ExcelJS.Workbook();
    const worksheet = work_book.addWorksheet("Requests");

    const column_widths = [15, 25, 20, 25, 20, 25, 25]; // Adjust widths as needed
    worksheet.getColumn(1).width = column_widths[0];
    worksheet.getColumn(2).width = column_widths[1];
    worksheet.getColumn(3).width = column_widths[2];
    worksheet.getColumn(4).width = column_widths[3];
    worksheet.getColumn(5).width = column_widths[4];
    worksheet.getColumn(6).width = column_widths[5];
    worksheet.getColumn(7).width = column_widths[6];

    // Define headers for the Excel sheet
    const headers = [
      "SR No",
      "Request ID",
      "Request State",
      "Confirmation No",
      "Requestor",
      "Requested Date",
      "Date of Service",
      // Add more headers as needed
    ];

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // // Define a spaced style with increased bottom padding
    // const spacedStyle = {
    //   font: { size: 11 },
    //   alignment: { vertical: "center" },
    //   border: { bottom: { style: "thin" } },
    // };

    // // Add the style to the workbook
    // work_book.addStyles(spacedStyle);

    // Add data to the worksheet
    for (const request of formatted_response.data) {
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
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Write the work_book to the response
    await work_book.xlsx.write(res);

    return res.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const export_all: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };
    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const zip = new JSZip();

    const where_clause_patient = {
      type_of_user: "patient",
      ...(search && {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(region && { state: region }),
    };

    const states = [
      "new",
      "pending",
      "active",
      "conclude",
      "toclose",
      "unpaid",
    ];

    const work_book = new ExcelJS.Workbook();

    for (const state of states) {
      const handle_request_state = async (additional_attributes?: any) => {
        const formatted_response: FormattedResponse<any> = {
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
            ...(additional_attributes || []),
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
                    required: false, // Make physician association optional
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
          const formatted_request: any = {
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
          formatted_response.data.push(formatted_request);
        }

        return formatted_response;
      };
      const formatted_response = await handle_request_state();

      // Create a new worksheet for each state
      const worksheet = work_book.addWorksheet(state);

      const column_widths = [15, 25, 20, 25, 20, 25, 25]; // Adjust widths as needed
      worksheet.getColumn(1).width = column_widths[0];
      worksheet.getColumn(2).width = column_widths[1];
      worksheet.getColumn(3).width = column_widths[2];
      worksheet.getColumn(4).width = column_widths[3];
      worksheet.getColumn(5).width = column_widths[4];
      worksheet.getColumn(6).width = column_widths[5];
      worksheet.getColumn(7).width = column_widths[6];

      // Define headers for the Excel sheet
      const headers = [
        "Request ID",
        "Request State",
        "Confirmation No",
        "Requestor",
        "Requested Date",
        "Date of Service",
      ];

      worksheet.addRow(headers);

      for (const request of formatted_response.data) {
        const rowData = [
          request.request_id,
          request.request_state,
          request.confirmationNo,
          request.requestor,
          request.requested_date,
          request.date_of_service,
        ];
        worksheet.addRow(rowData);
      }

      // Create a buffer containing the Excel workbook data
      const excelBuffer = await work_book.xlsx.writeBuffer();

      // Add the workbook data to the ZIP file with a descriptive filename
      zip.file(`${state}.xlsx`, excelBuffer);
    }

    // Generate a unique filename for the Excel file
    const filename = `requests_${new Date().toISOString()}.zip`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Write the ZIP file to the response
    const zip_archive = await zip.generateAsync({ type: "nodebuffer" });
    if (zip_archive) {
      // console.log(res);
      return res.end(zip_archive);
    } else {
      return res.status(500).json({ message: message_constants.ISE });
    }

    // // Alternate Way
    // await zip
    //   .generateAsync({ type: "nodebuffer" })
    //   .then((content) => res.end(content))
    //   .catch((error) => console.error(error));

    // return res.end();
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
    const formatted_response: FormattedResponse<any> = {
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
    const formatted_request = {
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
    };
    formatted_response.data.push(formatted_request);

    return res.status(200).json({
      ...formatted_response,
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
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };
      const physicians = await User.findAll({
        attributes: ["firstname", "lastname", "type_of_user"],
        where: {
          type_of_user: "physician",
        },
      });

      if (!physicians) {
        return res.status(404).json({ error: message_constants.EFPD });
      }
      for (const physician of physicians) {
        const formatted_request = {
          physician_name: physician.firstname + " " + physician.lastname,
        };
        formatted_response.data.push(formatted_request);
      }
      return res.status(200).json({
        ...formatted_response,
      });
    } catch (error) {
      console.log(error);
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
      const { account_type } = req.query as {
        [key: string]: string;
      };
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };
      const roles = await Role.findAll({
        attributes: ["role_id", "role_name"],
        where: {
          ...(account_type
            ? { account_type: account_type }
            : { account_type: "all" }),
          // ...(account_type && { account_type: account_type }),
        },
      });

      if (!roles) {
        return res.status(404).json({ error: message_constants.EFPD });
      }
      for (const role of roles) {
        const formatted_request = {
          role_id: role.role_id,
          role_name: role.role_name,
        };
        formatted_response.data.push(formatted_request);
      }
      return res.status(200).json({
        ...formatted_response,
      });
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};

/**Access ID's */
export const access: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { account_type } = req.query as {
        [key: string]: string;
      };
      const formatted_response: FormattedResponse<any> = {
        status: true,
        data: [],
      };

      const accesses = await Access.findAll({
        attributes: ["access_id", "access_name"],
        where: {
          ...(account_type ? { account_type } : { account_type: "all" }),
        },
      });
      if (!accesses) {
        return res.status(404).json({ error: message_constants.NF });
      }
      for (const access of accesses) {
        const formatted_request = {
          access_id: access.access_id,
          access_name: access.access_name,
        };
        formatted_response.data.push(formatted_request);
      }
      return res.status(200).json({
        ...formatted_response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};
