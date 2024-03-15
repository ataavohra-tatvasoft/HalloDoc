import Region from "../../db/models/previous_models/region";
import Profession from "../../db/models/previous_models/profession";
import { Request, Response, NextFunction } from "express";
import { Controller } from "../../interfaces/common_interface";
import User from "../../db/models/user_2";
import message_constants from "../../public/message_constants";

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
        attributes: ["region_id", "region_name"],
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
