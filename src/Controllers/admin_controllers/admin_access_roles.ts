import { Request, Response, NextFunction } from "express";
import RequestModel from "../../db/models/request_2";
import User from "../../db/models/user_2";
import Notes from "../../db/models/notes_2";
import { Op } from "sequelize";
import dotenv from "dotenv";

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
export const manageAccountAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { action } = req.query;

    switch (action) {
      case "list": {
        try {
          const { page, pageSize } = req.query as {
            page: string;
            pageSize: string;
          };
          const pageNumber = parseInt(page) || 1;
          const limit = parseInt(pageSize) || 10;
          const offset = (pageNumber - 1) * limit;
          const formattedResponse: any = {
            status: true,
            data: [],
          };
          const { count, rows: accounts } = await User.findAndCountAll({
            where: {
              status: "active",
            },
            attributes: ["user_id", "firstname", "lastname", "type_of_user"],
            limit,
            offset,
          });

          if (!accounts) {
            return res.status(404).json({ error: "Accounts not found" });
          }

          let i = offset + 1;
          for (const account of accounts) {
            const formattedRequest: any = {
              sr_no: i,
              user_id: account.user_id,
              name: `${account.firstname} ${account.lastname}`,
              account_type: account.type_of_user,
            };
            formattedResponse.data.push(formattedRequest);
            i++;
          }

          return res.status(200).json({
            ...formattedResponse,
            totalPages: Math.ceil(count / limit),
            currentPage: pageNumber,
          });
        } catch (error) {
          console.error("Error fetching account list:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      case "edit": {
        try {
          const { user_id } = req.params;
          const formattedResponse: any = {
            status: true,
            data: [],
          };
          const account = await User.findOne({
            where: {
              user_id: user_id,
              status: "active",
            },
            attributes: [
              "user_id",
              "firstname",
              "lastname",
              "mobile_no",
              "address_1",
              "address_2",
              "city",
              "state",
              "zip",
              "dob",
              "state",
              "type_of_user",
            ],
          });
          if (!account) {
            return res.status(404).json({ error: "Account not found" });
          }
          const formattedRequest: any = {
            user_id: account.user_id,
            firstname: account.firstname,
            lastname: account.lastname,
            mobile_no: account.mobile_no,
            address_1: account.address_1,
            address_2: account.address_2,
            city: account.city,
            region: account.state,
            zip: account.zip,
            dob: account.dob.toISOString().split("T")[0],
            state: account.state,
            account_type: account.type_of_user,
          };
          formattedResponse.data.push(formattedRequest);

          return res.status(200).json({
            ...formattedResponse,
          });
        } catch (error) {
          console.error("Error fetching account for editing:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      case "save": {
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
              status: "active",
            },
          });
          if (!account) {
            return res.status(404).json({ error: "Account not found" });
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
            return res
              .status(404)
              .json({ error: "Error while editing account information" });
          }
          return res.status(200).json({
            status: true,
            message: "Edited Successfully !!!",
          });
        } catch (error) {
          console.error("Error fetching account for editing:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      case "delete": {
        try {
          const { user_id } = req.params;
          const account = await User.findOne({
            where: {
              user_id,
              status: "active",
            },
          });

          if (!account) {
            return res.status(404).json({ error: "Account not found" });
          }

          const relatedRequests = await RequestModel.findAll({
            where: { patient_id: user_id },
          });

          if (relatedRequests.length > 0) {
            // Assuming a one-to-many relationship between requests and notes:
            const relatedNotes = await Notes.destroy({
              where: {
                requestId: relatedRequests.map((request) => request.request_id),
              },
            });
            if (!relatedNotes) {
              return res
                .status(400)
                .json({ error: "Error while deleting account" });
            }

            // Option 2: Cascade deletion (use with caution)
            await RequestModel.destroy({ where: { patient_id: user_id } });
          }

          const deletedAccount = await User.destroy({ where: { user_id } });

          if (!deletedAccount) {
            return res
              .status(400)
              .json({ error: "Error while deleting account" });
          }

          return res
            .status(200)
            .json({ status: true, message: "Deleted Successfully!" });
        } catch (error) {
          console.error("Error deleting account:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling account access:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const access_accountaccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, pageSize } = req.query as {
      page: string;
      pageSize: string;
    };
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(pageSize) || 10;
    const offset = (pageNumber - 1) * limit;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const { count, rows: accounts } = await User.findAndCountAll({
      where: {
        status: "active",
      },
      attributes: ["user_id", "firstname", "lastname", "type_of_user"],
      limit,
      offset,
    });

    if (!accounts) {
      return res.status(404).json({ error: "Accounts not found" });
    }

    var i = offset + 1;
    for (const account of accounts) {
      const formattedRequest: any = {
        sr_no: i,
        user_id: account.user_id,
        name: account.firstname + " " + account.lastname,
        account_type: account.type_of_user,
      };
      formattedResponse.data.push(formattedRequest);
      i++;
    }

    return res.status(200).json({
      ...formattedResponse,
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    const account = await User.findOne({
      where: {
        user_id: user_id,
        status: "active",
      },
      attributes: [
        "user_id",
        "firstname",
        "lastname",
        "mobile_no",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "dob",
        "state",
        "type_of_user",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    const formattedRequest: any = {
      user_id: account.user_id,
      firstname: account.firstname,
      lastname: account.lastname,
      mobile_no: account.mobile_no,
      address_1: account.address_1,
      address_2: account.address_2,
      city: account.city,
      region: account.state,
      zip: account.zip,
      dob: account.dob.toISOString().split("T")[0],
      state: account.state,
      account_type: account.type_of_user,
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_edit_save = async (
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
        status: "active",
      },
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
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
      return res.status(404).json({ error: "Error while editing information" });
    }
    return res.status(200).json({
      status: true,
      message: "Edited Successfully !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_accountaccess_delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const account = await User.findOne({
      where: {
        user_id,
        status: "active",
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const relatedRequests = await RequestModel.findAll({
      where: { patient_id: user_id },
    });

    if (relatedRequests.length > 0) {
      // Option 1: Prevent deletion with informative error
      // return res.status(409).json({
      //   error: "Cannot delete account as it has associated requests. Please handle these requests first."
      // });

      // Assuming a one-to-many relationship between requests and notes:
      const relatedNotes = await Notes.destroy({
        where: {
          requestId: relatedRequests.map((request) => request.request_id),
        },
      });
      if (!relatedNotes) {
        return res.status(400).json({ error: "Error while deleting account" });
      }

      // Option 2: Cascade deletion (use with caution)
      await RequestModel.destroy({ where: { patient_id: user_id } });
    }

    const deletedAccount = await User.destroy({ where: { user_id } });

    if (!deletedAccount) {
      return res.status(400).json({ error: "Error while deleting account" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Deleted Successfully!" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
export const manageUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { action } = req.query; // Get action parameter from query string

    switch (action) {
      // Action to retrieve users based on role
      case "list": {
        try {
          const { role } = req.query; // Get role parameter from query string
          const whereClause: { [key: string]: any } = {};
          const formattedResponse: any = {
            status: true,
            data: [],
          };
          if (role) {
            whereClause.firstname = {
              [Op.like]: `%${role}%`, // Use LIKE operator for partial matching
            };
          }

          // Retrieve users from the database based on search criteria
          const accounts = await User.findAll({
            attributes: [
              "role",
              "firstname",
              "lastname",
              "mobile_no",
              "status",
              "open_requests",
            ],
            where: whereClause,
          });

          if (!accounts) {
            return res.status(404).json({ error: "No matching users found" });
          }

          // Format retrieved users for response
          for (const account of accounts) {
            const formattedRequest: any = {
              account_type: account.role,
              account_poc: `${account.firstname} ${account.lastname}`,
              phone: account.mobile_no,
              status: account.status,
              open_requests: account.open_requests,
            };
            formattedResponse.data.push(formattedRequest);
          }

          // Send formatted response
          return res.status(200).json({
            ...formattedResponse,
          });
        } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      // Action to retrieve a user for editing
      case "edit": {
        try {
          const { user_id } = req.params; // Get user_id parameter from request parameters
          const formattedResponse: any = {
            status: true,
            data: [],
          };
          // Retrieve user from the database
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
              "role",
              "status",
            ],
          });
          if (!account) {
            return res.status(404).json({ error: "Account not found" });
          }

          // Format retrieved user for response
          const formattedRequest: any = {
            firstname: account.firstname,
            lastname: account.lastname,
            phone: account.mobile_no,
            address_1: account.address_1,
            address_2: account.address_2,
            city: account.city,
            region: account.state,
            zip: account.zip,
            DOB: account.dob,
            account_type: account.role,
            status: account.status,
          };
          formattedResponse.data.push(formattedRequest);

          // Send formatted response
          return res.status(200).json({
            ...formattedResponse,
          });
        } catch (error) {
          console.error("Error fetching user for editing:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      // Action to save changes made to a user
      case "save": {
        try {
          const { user_id } = req.params; // Get user_id parameter from request parameters
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
          } = req.body; // Extract user data from request body
          // Retrieve user from the database
          const account = await User.findOne({
            where: {
              user_id: user_id,
            },
          });
          if (!account) {
            return res.status(404).json({ error: "Account not found" });
          }
          // Update user information in the database
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
            return res.status(404).json({ error: "Error while editing information" });
          }
          // Send success response
          return res.status(200).json({
            status: true,
            message: "Edited Successfully !!!",
          });
        } catch (error) {
          console.error("Error fetching user for editing:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      default:
        return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling user access:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const access_useraccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.query; // Get search parameters from query string
    const whereClause: { [key: string]: any } = {};
    const formattedResponse: any = {
      status: true,
      data: [],
    };
    if (role) {
      whereClause.firstname = {
        [Op.like]: `%${role}%`, // Use LIKE operator for partial matching
      };
    }

    const accounts = await User.findAll({
      attributes: [
        "role",
        "firstname",
        "lastname",
        "mobile_no",
        "status",
        "open_requests",
      ],
      where: whereClause, // Apply constructed search criteria
    });

    if (!accounts) {
      return res.status(404).json({ error: "No matching users found" });
    }
    for (const account of accounts) {
      const formattedRequest: any = {
        account_type: account.role,
        account_poc: account.firstname + " " + account.lastname,
        phone: account.mobile_no,
        status: account.status,
        open_requests: account.open_requests,
      };
      formattedResponse.data.push(formattedRequest);
    }
    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_useraccess_edit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const formattedResponse: any = {
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
        "role",
        "status",
      ],
    });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const formattedRequest: any = {
      firstname: account.firstname,
      lastname: account.lastname,
      phone: account.mobile_no,
      address_1: account.address_1,
      address_2: account.address_2,
      city: account.city,
      region: account.state,
      zip: account.zip,
      DOB: account.dob,
      account_type: account.role,
      status: account.status,
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const access_useraccess_edit_save = async (
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
      return res.status(404).json({ error: "Account not found" });
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
      return res.status(404).json({ error: "Error while editing information" });
    }
    return res.status(200).json({
      status: true,
      message: "Edited Successfully !!!",
    });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//API for Create role All, Admin, Physician, Patient remaining
