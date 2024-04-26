import Region from "../../db/models/region";
import Profession from "../../db/models/profession";
import { Request, Response, NextFunction } from "express";
import { Controller, VerifiedToken } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import RequestModel from "../../db/models/request";
import Role from "../../db/models/role";
import ExcelJS from "exceljs";
import Access from "../../db/models/access";
import JSZip from "jszip";
import { FormattedResponse } from "../../interfaces/common_interface";
import {
  handle_request_state_exports,
  handle_request_state_physician_exports,
} from "../../utils/helper_functions";
import jwt from "jsonwebtoken";

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
