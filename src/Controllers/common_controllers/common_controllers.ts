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
