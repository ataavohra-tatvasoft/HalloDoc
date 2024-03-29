import { Request, Response, NextFunction } from "express";
import User from "../../db/models/user";
import Region from "../../db/models/region";
import { Controller } from "../../interfaces/common_interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import message_constants from "../../public/message_constants";
import UserRegionMapping from "../../db/models/user-region_mapping";

/** Configs */
dotenv.config({ path: `.env` });

/**Admin in My Profile */

/**
 * @description Retrieves and formats the profile data of an admin user.
 * @param {Request} req - The request object containing the authorization token.
 * @param {Response} res - The response object to send the admin profile data.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response containing the formatted admin profile data or an error message.
 */
export const admin_profile_view: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers as { authorization: string };
    const token: string = authorization.split(" ")[1];
    const verifiedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    console.log(verifiedToken);
    const admin_id = verifiedToken.user_id;
    const profile = await User.findOne({
      where: {
        user_id: admin_id,
      },
      attributes: [
        "user_id",
        // "username",
        "role",
        "status",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
      ],
      include: [
        {
          model: Region,
        },
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }
    console.log(profile.Regions);
    const formattedRequest: any = {
      user_id: profile.user_id,
      account_information: {
        username: "dummy",
        status: profile.status,
        role: profile.role,
      },
      administrator_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        regions: profile.Regions?.map((region) => ({
          region_id: region.region_id,
          region_name: region.region_name,
        })),
      },
      mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no,
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Resets the password of an admin user.
 * @param {Request} req - The request object containing the new password and admin ID.
 * @param {Response} res - The response object to send the status of the password reset operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the password reset operation.
 */
export const admin_profile_reset_password: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { password, user_id },
    } = req;

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const user_data = await User.findOne({
      where: {
        user_id,
      },
    });
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword },
        {
          where: {
            user_id,
          },
        }
      );
      if (updatePassword) {
        res.status(200).json({ status: message_constants.Success });
      }
    }
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

/**
 * @description Handles the editing of admin profile information including personal and billing details.
 * @param {Request} req - The request object containing the admin profile data to be updated.
 * @param {Response} res - The response object to send the status of the operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the profile update operation.
 */

export const admin_profile_edit: Controller = async (
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
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no,
    } = req.body;

    const adminprofile = await User.findOne({
      where: {
        user_id,
      },
    });

    if (!adminprofile) {
      return res.status(404).json({ error: message_constants.ANF });
    }

    const updateProfileStatus = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
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

    if (!updateProfileStatus) {
      return res.status(500).json({ status: message_constants.EWU });
    }

    if (district_of_columbia || new_york || virginia || maryland) {
      const regions = [
        { name: "District of Columbia", value: district_of_columbia },
        { name: "New York", value: new_york },
        { name: "Virginia", value: virginia },
        { name: "Maryland", value: maryland },
      ];

      for (const region of regions) {
        const { name, value } = region;

        const regionData = await Region.findOne({
          where: {
            region_name: name,
          },
          attributes: ["region_id"],
        });

        if (value) {
          const is_exist = await UserRegionMapping.findOne({
            where: {
              user_id: adminprofile.user_id,
              region_id: regionData?.region_id,
            },
          });

          if (is_exist) {
            const mapping = await UserRegionMapping.update(
              {
                user_id: adminprofile.user_id,
                region_id: regionData?.region_id,
              },
              {
                where: {
                  user_id: adminprofile.user_id,
                  region_id: regionData?.region_id,
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
              user_id: adminprofile.user_id,
              region_id: regionData?.region_id,
            });

            if (!mapping) {
              return res.status(500).json({
                message: message_constants.EWC,
              });
            }
          }
        } else {
          const is_exist = await UserRegionMapping.findOne({
            where: {
              user_id: adminprofile.user_id,
              region_id: regionData?.region_id,
            },
          });

          if (is_exist) {
            const delete_mapping = await UserRegionMapping.destroy({
              where: {
                user_id: adminprofile.user_id,
                region_id: regionData?.region_id,
              },
            });

            if (!delete_mapping) {
              return res.status(500).json({
                message: message_constants.EWD,
              });
            }
          }
        }
      }
    }

    return res.status(200).json({ status: message_constants.US });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

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
    const adminprofile = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!adminprofile) {
      return res.status(404).json({ error: message_constants.ANF });
    }
    const updatestatus = await User.update(
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
    if (!updatestatus) {
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: adminprofile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: adminprofile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: adminprofile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const mapping = await UserRegionMapping.update(
          {
            user_id: adminprofile.user_id,
            region_id: region?.region_id,
          },
          {
            where: {
              user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
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
          user_id: adminprofile.user_id,
          region_id: region?.region_id,
        },
      });
      if (is_exist) {
        const delete_mapping = await UserRegionMapping.destroy({
          where: {
            user_id: adminprofile.user_id,
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
};

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
      const adminprofile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!adminprofile) {
        return res.status(404).json({ error: message_constants.ANF });
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
        return res.status(200).json({ status: message_constants.US });
      }
    } catch (error) {
      return res.status(500).json({ error: message_constants.ISE });
    }
  }
};
