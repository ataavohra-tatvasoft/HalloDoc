import Region from "../../db/models/region";
import Profession from "../../db/models/profession";
import { Request, Response, NextFunction } from "express";
import { Controller, VerifiedToken } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import RequestModel from "../../db/models/request";
import Role from "../../db/models/role";
import Notes from "../../db/models/notes";
import ExcelJS from "exceljs";
import Access from "../../db/models/access";
import JSZip from "jszip";
import { FormattedResponse } from "../../interfaces/common_interface";
import {
  handle_request_state_exports,
  handle_request_state_physician_exports,
} from "../../utils/helper_functions";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

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
      region_id: each.region_id,
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

    let formatted_response = null;

    switch (state) {
      case "new":
        formatted_response = await handle_request_state_exports(
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
        break;
      case "pending":
      case "active":
      case "conclude":
        formatted_response = await handle_request_state_exports(
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
        break;
      case "toclose":
        formatted_response = await handle_request_state_exports(
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
        break;
      case "unpaid":
        formatted_response = await handle_request_state_exports(
          state,
          search,
          region,
          requestor,
          page,
          page_size,
          ["date_of_service", "physician_id", "patient_id"]
        );
        break;
      default:
        return res.status(500).json({ message: message_constants.IS });
    }

    // Create a new Excel work_book and worksheet
    const work_book = new ExcelJS.Workbook();
    const worksheet = work_book.addWorksheet("Requests");

    const column_widths = [15, 25, 20, 25, 20, 25, 25, 25, 20, 25, 50]; // Adjust widths as needed
    worksheet.getColumn(1).width = column_widths[0];
    worksheet.getColumn(2).width = column_widths[1];
    worksheet.getColumn(3).width = column_widths[2];
    worksheet.getColumn(4).width = column_widths[3];
    worksheet.getColumn(5).width = column_widths[4];
    worksheet.getColumn(6).width = column_widths[5];
    worksheet.getColumn(7).width = column_widths[6];
    worksheet.getColumn(8).width = column_widths[7];
    worksheet.getColumn(9).width = column_widths[8];
    worksheet.getColumn(10).width = column_widths[9];
    worksheet.getColumn(11).width = column_widths[10];

    // Define headers for the Excel sheet
    const headers = [
      "SR No",
      "Request State",
      "Confirmation No",
      "Name",
      "Date Of Birth",
      "Requestor",
      "Requested Date",
      "Date of Service",
      "Physician Name",
      "Phone",
      "Address",
      // Add more headers as needed
    ];

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // Add data to the worksheet
    for (const request of formatted_response.data) {
      // console.log(request);
      const rowData = [
        request.sr_no,
        request.request_state,
        request.confirmationNo,
        request.patient_data.name,
        request.patient_data.DOB,
        request.requestor_data.first_name +
          " " +
          request.requestor_data.last_name,
        request.requested_date,
        request.date_of_service,
        request.physician_data.name,
        request.physician_data.mobile_no,
        request.physician_data.address,
        // Add more data fields as needed
      ];
      worksheet.addRow(rowData);
    }

    // Generate a unique filename for the Excel file
    const current_date = new Date().toISOString().split("T")[0];
    const filename = `requests_${state}_${current_date}`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.xlsx"`
    );

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
    const zip = new JSZip();

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
      const formatted_response = await handle_request_state_exports(
        state,
        search,
        region,
        requestor,
        page,
        page_size
      );

      // Create a new worksheet for each state
      const worksheet = work_book.addWorksheet(state);

      const column_widths = [15, 25, 20, 25, 20, 25, 25, 25, 20, 25, 50]; // Adjust widths as needed
      worksheet.getColumn(1).width = column_widths[0];
      worksheet.getColumn(2).width = column_widths[1];
      worksheet.getColumn(3).width = column_widths[2];
      worksheet.getColumn(4).width = column_widths[3];
      worksheet.getColumn(5).width = column_widths[4];
      worksheet.getColumn(6).width = column_widths[5];
      worksheet.getColumn(7).width = column_widths[6];
      worksheet.getColumn(8).width = column_widths[7];
      worksheet.getColumn(9).width = column_widths[8];
      worksheet.getColumn(10).width = column_widths[9];
      worksheet.getColumn(11).width = column_widths[10];

      // Define headers for the Excel sheet
      const headers = [
        "SR No",
        "Request State",
        "Confirmation No",
        "Name",
        "Date Of Birth",
        "Requestor",
        "Requested Date",
        "Date of Service",
        "Physician Name",
        "Phone",
        "Address",
        // Add more headers as needed
      ];

      // Add headers to the worksheet
      worksheet.addRow(headers);

      // Add data to the worksheet
      for (const request of formatted_response.data) {
        console.log(request);
        const rowData = [
          request?.sr_no,
          request?.request_state,
          request?.confirmationNo,
          request?.patient_data?.name,
          request?.patient_data?.DOB,
          request?.requestor_data?.first_name +
            " " +
            request?.requestor_data?.last_name,
          request?.requested_date,
          request?.date_of_service,
          request?.physician_data?.name,
          request?.physician_data?.mobile_no,
          request?.physician_data?.address,
          // Add more data fields as needed
        ];
        worksheet.addRow(rowData);
      }
      // Create a buffer containing the Excel workbook data
      const excelBuffer = await work_book.xlsx.writeBuffer();

      // Add the workbook data to the ZIP file with a descriptive filename
      zip.file(`${state}.xlsx`, excelBuffer);
    }

    // Generate a unique filename for the Excel file
    const current_date = new Date().toISOString().split("T")[0];
    const filename = `requests_${current_date}`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}.zip`
    );

    // Write the ZIP file to the response
    const zip_archive = await zip.generateAsync({ type: "nodebuffer" });
    if (zip_archive) {
      // console.log(res);
      return res.end(zip_archive);
    } else {
      return res.status(500).json({ message: message_constants.ISE });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const export_single_physician: Controller = async (
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

    const user = await User.findOne({
      where: {
        user_id: verified_token.user_id,
        type_of_user: "physician",
      },
    });
    if (!user) {
      return res.status(404).json({
        message: message_constants.PNF,
      });
    }
    const user_id = user.user_id;
    const { state, search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };

    let formatted_response = null;

    switch (state) {
      case "new":
      case "pending":
      case "conclude":
        formatted_response = await handle_request_state_physician_exports(
          user_id,
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
        break;
      case "active":
        formatted_response = await handle_request_state_physician_exports(
          user_id,
          state,
          search,
          region,
          requestor,
          page,
          page_size
        );
        break;
      default:
        return res.status(500).json({ message: message_constants.IS });
    }

    // Create a new Excel work_book and worksheet
    const work_book = new ExcelJS.Workbook();
    const worksheet = work_book.addWorksheet("Requests");

    const column_widths = [15, 25, 20, 25, 20, 25, 40]; // Adjust widths as needed
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
      "Patient Name",
      "Phone Number",
      "Address",
      // Add more headers as needed
    ];

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // Add data to the worksheet
    for (const request of formatted_response.data) {
      const rowData = [
        request.sr_no,
        request.request_id,
        request.request_state,
        request.confirmation_no,
        request.patient_data.name,
        request.patient_data.mobile_no,
        request.patient_data.address,
        // Add more data fields as needed
      ];
      worksheet.addRow(rowData);
    }

    // Generate a unique filename for the Excel file
    const current_date = new Date().toISOString().split("T")[0];
    const filename = `physicians_requests_${state}_${current_date}`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.xlsx"`
    );

    // Write the work_book to the response
    await work_book.xlsx.write(res);

    return res.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const export_all_physician: Controller = async (
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

    const user = await User.findOne({
      where: {
        user_id: verified_token.user_id,
        type_of_user: "physician",
      },
    });
    if (!user) {
      return res.status(404).json({
        message: message_constants.PNF,
      });
    }
    const user_id = user.user_id;
    const { search, region, requestor, page, page_size } = req.query as {
      [key: string]: string;
    };

    let formatted_response = null;
    const zip = new JSZip();

    const states = ["new", "pending", "active", "conclude"];

    const work_book = new ExcelJS.Workbook();

    for (const state of states) {
      console.log(state);
      switch (state) {
        case "new":
        case "pending":
        case "conclude":
          formatted_response = await handle_request_state_physician_exports(
            user_id,
            state,
            search,
            region,
            requestor,
            page,
            page_size
          );
          break;
        case "active":
          formatted_response = await handle_request_state_physician_exports(
            user_id,
            state,
            search,
            region,
            requestor,
            page,
            page_size
          );
          break;
        default:
          return res.status(500).json({ message: message_constants.IS });
      }

      const worksheet = work_book.addWorksheet(state);

      const column_widths = [15, 25, 20, 25, 20, 25, 40]; // Adjust widths as needed
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
        "Patient Name",
        "Phone Number",
        "Address",
      ];

      // Add headers to the worksheet
      worksheet.addRow(headers);

      // Add data to the worksheet
      for (const request of formatted_response.data) {
        const rowData = [
          request.sr_no,
          request.request_id,
          request.request_state,
          request.confirmation_no,
          request.patient_data.name,
          request.patient_data.mobile_no,
          request.patient_data.address,
        ];
        worksheet.addRow(rowData);
      }

      // Create a buffer containing the Excel workbook data
      const excelBuffer = await work_book.xlsx.writeBuffer();

      // Add the workbook data to the ZIP file with a descriptive filename
      zip.file(`${state}.xlsx`, excelBuffer);
    }

    // Generate a unique filename for the Excel file
    const current_date = new Date().toISOString().split("T")[0];
    const filename = `physicians_requests_${current_date}.zip`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.zip"`
    );

    // Write the ZIP file to the response
    const zip_archive = await zip.generateAsync({ type: "nodebuffer" });
    if (zip_archive) {
      // console.log(res);
      return res.end(zip_archive);
    } else {
      return res.status(500).json({ message: message_constants.ISE });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message_constants.ISE });
  }
};

export const export_records: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      request_status,
      patient_name,
      request_type,
      from_date_of_service,
      to_date_of_service,
      provider_name,
      email,
      phone_no,
      page,
      page_size,
    } = req.query;

    const page_number = Number(page) || 1;
    const limit = Number(page_size) || 10;
    const offset = (page_number - 1) * limit;
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: [],
    };
    const where_clause = {
      ...(request_type && {
        request_state: { [Op.like]: `%${request_type}%` },
      }),
      ...(from_date_of_service && {
        date_of_service: { [Op.gte]: from_date_of_service }, // Use Op.gte for greater than or equal
      }),
      ...(to_date_of_service && {
        date_of_service: { [Op.lte]: to_date_of_service }, // Use Op.lte for less than or equal
      }),
      ...(request_status && {
        request_status: { [Op.like]: `%${request_status}%` },
      }),
      // ... potentially add other WhereOptions properties
    };

    const { rows: requests } = await RequestModel.findAndCountAll({
      attributes: [
        "request_id",
        "confirmation_no",
        "requested_by",
        "date_of_service",
        "closed_date",
        "request_state",
        "request_status",
        "street",
        "city",
        "state",
        "zip",
      ],
      where: where_clause,
      include: [
        {
          model: User,
          as: "Patient",
          attributes: [
            "user_id",
            "firstname",
            "lastname",
            "email",
            "mobile_no",
            "address_1",
            "address_2",
            "zip",
          ],
          where: {
            ...(patient_name && {
              [Op.or]: [
                { firstname: { [Op.like]: `%${patient_name}%` } },
                { lastname: { [Op.like]: `%${patient_name}%` } },
              ],
            }),
            ...(email && {
              email: { [Op.like]: `%${email}%` },
            }),
            ...(phone_no && {
              mobile_no: { [Op.like]: `%${phone_no}%` },
            }),
          },
        },
        {
          model: User,
          as: "Physician",
          attributes: ["user_id", "firstname", "lastname"],
          where: {
            ...(provider_name && {
              [Op.or]: [
                { firstname: { [Op.like]: `%${provider_name}%` } },
                { lastname: { [Op.like]: `%${provider_name}%` } },
              ],
            }),
          },
        },
      ],
      limit,
      offset,
    });

    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF,
      });
    }

    const { count: total_count } = await RequestModel.findAndCountAll({
      where: where_clause,
      include: [
        {
          model: User,
          as: "Patient",
          where: {
            ...(patient_name && {
              [Op.or]: [
                { firstname: { [Op.like]: `%${patient_name}%` } },
                { lastname: { [Op.like]: `%${patient_name}%` } },
              ],
            }),
            ...(email && {
              email: { [Op.like]: `%${email}%` },
            }),
            ...(phone_no && {
              mobile_no: { [Op.like]: `%${phone_no}%` },
            }),
          },
        },
      ],
      limit,
      offset,
    });

    if (!total_count) {
      return res.status(404).json({
        message: message_constants.EWCounting,
      });
    }

    var i: number = offset + 1;
    for (const request of requests) {
      const physician_note = await Notes.findOne({
        where: {
          request_id: request.request_id,
          type_of_note: "physician_notes",
        },
      });
      const cancelled_by_provider_note = await Notes.findOne({
        where: {
          request_id: request.request_id,
          type_of_note: "physician_cancellation_notes",
        },
      });
      const admin_note = await Notes.findOne({
        where: {
          request_id: request.request_id,
          type_of_note: "admin_notes",
        },
      });
      const patient_note = await Notes.findOne({
        where: {
          request_id: request.request_id,
          type_of_note: "patient_notes",
        },
      });
      const formatted_request = {
        sr_no: i,
        request_id: request.request_id,
        confirmation_no: request.confirmation_no,
        patient_name:
          request.Patient.firstname + " " + request.Patient.lastname,
        requestor: request.requested_by,
        date_of_service: request.date_of_service
          ? request.date_of_service.toISOString().split("T")[0]
          : null,
        closed_date: request.closed_date
          ? request.closed_date.toISOString().split("T")[0]
          : null,
        email: request.Patient.email,
        phone_no: request.Patient.mobile_no,
        address:
          request.Patient.address_1 +
          " " +
          request.Patient.address_2 +
          " " +
          request.Patient.state,
        zip: request.Patient.zip,
        request_status: request.request_status,
        physician:
          request.Physician.firstname + " " + request.Physician.lastname,
        physician_note: physician_note?.description || null,
        cancelled_by_provider_note:
          cancelled_by_provider_note?.description || null,
        admin_note: admin_note?.description || null,
        patient_note: patient_note?.description || null,
      };
      i++;
      formatted_response.data.push(formatted_request);
    }

    // Create a new Excel work_book and worksheet
    const work_book = new ExcelJS.Workbook();
    const worksheet = work_book.addWorksheet("Records");

    const column_widths = [
      25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
    ]; // Adjust widths as needed
    worksheet.getColumn(1).width = column_widths[0];
    worksheet.getColumn(2).width = column_widths[1];
    worksheet.getColumn(3).width = column_widths[2];
    worksheet.getColumn(4).width = column_widths[3];
    worksheet.getColumn(5).width = column_widths[4];
    worksheet.getColumn(6).width = column_widths[5];
    worksheet.getColumn(7).width = column_widths[6];
    worksheet.getColumn(8).width = column_widths[7];
    worksheet.getColumn(9).width = column_widths[8];
    worksheet.getColumn(10).width = column_widths[9];
    worksheet.getColumn(11).width = column_widths[10];
    worksheet.getColumn(12).width = column_widths[11];
    worksheet.getColumn(13).width = column_widths[12];
    worksheet.getColumn(14).width = column_widths[13];

    // Define headers for the Excel sheet
    const headers = [
      "Patient Name",
      "Requestor",
      "Date of Service",
      "Close Case Date",
      "Email",
      "Phone Number",
      "Address",
      "Zip",
      "Request Status",
      "Physician",
      "Physician Note",
      "Cancelled By Provider Note",
      "Admin Note",
      "Patient Note",
      // Add more headers as needed
    ];

    // Add headers to the worksheet
    worksheet.addRow(headers);

    // Add data to the worksheet
    for (const request of formatted_response.data) {
      const rowData = [
        request.patient_name,
        request.requestor,
        request.date_of_service,
        request.closed_date,
        request.email,
        request.phone_no,
        request.address,
        request.zip,
        request.request_status,
        request.physician,
        request.physician_note,
        request.cancelled_by_provider_note,
        request.admin_note,
        request.patient_note,
        // Add more data fields as needed
      ];
      worksheet.addRow(rowData);
    }

    // Generate a unique filename for the Excel file
    const current_date = new Date().toISOString().split("T")[0];
    const filename = `records_${current_date}`;

    // Set the response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.xlsx"`
    );

    // Write the work_book to the response
    await work_book.xlsx.write(res);

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
