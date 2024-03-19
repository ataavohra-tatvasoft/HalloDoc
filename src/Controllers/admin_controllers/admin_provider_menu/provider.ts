import { Request, Response, NextFunction } from "express";
import User from "../../../db/models/user_2";
import RequestModel from "../../../db/models/request_2";
import Notes from "../../../db/models/notes_2";
import Order from "../../../db/models/order_2";
import { Controller } from "../../../interfaces/common_interface";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import twilio from "twilio";
import Documents from "../../../db/models/documents_2";
import dotenv from "dotenv";
import message_constants from "../../../public/message_constants";


/** Configs */
dotenv.config({ path: `.env` });

/**                             Admin in Provider Menu                                    */

export const provider_list: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { region, page, pageSize } = req.query as {
      region: string;
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
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: [
        "user_id",
        "stop_notification_status",
        "firstname",
        "lastname",
        "role",
        "on_call_status",
        "status",
      ],
      where: {
        ...(region && { state: region }),
        type_of_user: "provider",
      },
    });
    var i = offset + 1;
    for (const provider of providers) {
      const formattedRequest: any = {
        sr_no: i,
        user_id: provider.user_id,
        stop_notification: provider.stop_notification_status,
        provider_name: provider.firstname + " " + provider.lastname,
        role: provider.role,
        on_call_status: provider.on_call_status,
        status: provider.status,
      };
      i++;
      formattedResponse.data.push(formattedRequest);
    }

    return res.status(200).json({
      ...formattedResponse,
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
      total_count: count,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const stop_notification: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { stop_notification_status } = req.query as {
      stop_notification_status: string;
    };

    const user = await User.findOne({
      where: {
        user_id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: message_constants.UNF });
    }
    await User.update(
      { stop_notification_status: stop_notification_status },
      {
        where: {
          user_id,
        },
      }
    );
    return res.status(200).json({
      message: message_constants.US,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const contact_provider: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const { email, mobile_no } = req.query;
    const { message } = req.body;
    const user = await User.findOne({
      where: {
        user_id,
        type_of_user: "provider",
      },
      attributes: ["user_id", "email", "mobile_no"],
    });
    if (!user) {
      return res.status(400).json({
        message: message_constants.IEM,
        errormessage: message_constants.UA,
      });
    }
    if (email) {
      const mailContent = `
          <html>
          <p>Given below is a message from admin:</p>
          <br>
          <br>
          <p>Message: ${message} </p>
          <br>
          <br>
          <br>
          <br>
          </html>
        `;

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        debug: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const info = await transporter.sendMail({
        from: "vohraatta@gmail.com",
        to: user.email,
        subject: "Message",
        html: mailContent,
      });
      if (!info) {
        res.status(500).json({
          message: message_constants.EWSM,
        });
      }
      return res.status(200).json({
        message: message_constants.ES,
      });
    }
    if (mobile_no) {
      const accountSid = "AC755f57f9b0f3440c6d2a207bd5678bdd";
      const authToken = "a795f37433f7542bea73622828e66841";
      const client = twilio(accountSid, authToken);

      await client.messages.create({
        body: `Message from admin: ${message}`,
        from: "+15187597839",
        to: "+91" + mobile_no,
      });

      return res.status(200).json({
        status: true,
        message: message_constants.MS,
      });
    }
  } catch (error) {
    return res.status(500).json({
      errormessage: message_constants.ISE,
    });
  }
};

export const view_edit_physician_account: Controller = async (
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
    const profile = await User.findOne({
      where: {
        user_id,
        type_of_user: "provider",
      },
      attributes: [
        "type_of_user",
        "user_id",
        "username",
        "status",
        "role",
        "firstname",
        "lastname",
        "email",
        "mobile_no",
        "medical_licence",
        "NPI_no",
        "synchronization_email",
        "district_of_columbia",
        "new_york",
        "virginia",
        "maryland",
        "address_1",
        "address_2",
        "city",
        "state",
        "zip",
        "billing_mobile_no",
        "business_name",
        "business_website",
        "admin_notes",
      ],
    });
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF });
    }
    const documents = await Documents.findAll({
      attributes: ["document_id", "document_name", "document_path"],
      where: {
        user_id,
        // document_name:
        //   "independent_contractor_agreement" ||
        //   "background_check" ||
        //   "HIPAA" ||
        //   "non_disclosure_agreement" ||
        //   "licence_document",
      },
    });
    if (!documents) {
      res.status(500).json({ error: message_constants.DNF });
    }
    const formattedRequest: any = {
      user_id: profile.user_id,
      account_information: {
        username: profile.username,
        status: profile.status,
        role: profile.role,
      },
      physician_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        medical_licence: profile.medical_licence,
        NPI_number: profile.NPI_no,
        synchronization_email: profile.synchronization_email,
        service_areas_availability: {
          district_of_columbia: profile.district_of_columbia,
          new_york: profile.new_york,
          virginia: profile.virginia,
          maryland: profile.maryland,
        },
      },
      mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no,
      },
      provider_profile: {
        business_name: profile.business_name,
        business_website: profile.business_website,
        admin_notes: profile.admin_notes,
      },
      onboarding: {
        documents: documents?.map((document: any) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path,
        })),
      },
    };
    formattedResponse.data.push(formattedRequest);

    return res.status(200).json({
      ...formattedResponse,
    });
  } catch (error) {
    res.status(500).json({ message: message_constants.ISE });
  }
};

export const physician_account_reset_password: Controller = async (
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
    const update_status = await User.update(
      { username, status, role },
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
        district_of_columbia,
        new_york,
        virginia,
        maryland,
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
          business_name,
          business_website,
          admin_notes,
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

export const delete_provider_account: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const { user_id } = req.params;

      const profile = await User.findOne({
        where: {
          user_id,
        },
      });
      if (!profile) {
        return res.status(404).json({ error: message_constants.PNF });
      }
      const related_requests = await RequestModel.findAll({
        where: { physician_id: user_id },
      });

      if (related_requests.length > 0) {
        const related_documents = await Documents.destroy({
          where: {
            request_id: related_requests.map((request) => request.request_id),
          },
        });
        if (!related_documents && related_documents != 0) {
          return res.status(400).json({ error: message_constants.EWDD });
        }
        const related_orders = await Order.destroy({
          where: {
            request_id: related_requests.map((request) => request.request_id),
          },
        });

        if (!related_orders && related_orders != 0) {
          return res.status(400).json({ error: message_constants.EWDO });
        }

        const related_notes = await Notes.destroy({
          where: {
            request_id: related_requests.map((request) => request.request_id),
          },
        });

        if (!related_notes && related_notes != 0) {
          return res.status(400).json({ error: message_constants.EWDN });
        }

        await RequestModel.destroy({ where: { physician_id: user_id } });
      }
      const delete_profile = await User.destroy({
        where: {
          user_id,
        },
      });

      if (!delete_profile) {
        return res.status(404).json({ error: message_constants.EWDP });
      }
      return res.status(200).json({
        message: message_constants.DS,
      });
    } catch (error) {
      res.status(500).json({ error: message_constants.ISE });
    }
  }
};

export const provider_profile_upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.params;
    const uploaded_files: any = req.files || [];

    const profile_picture_path = uploaded_files.find(
      (file: any) => file.fieldname === "profile_picture"
    )?.path;
    const signature_photo_path = uploaded_files.find(
      (file: any) => file.fieldname === "signature_photo"
    )?.path;

    if (profile_picture_path || signature_photo_path) {
      const updated_user = await User.update(
        {
          profile_picture: profile_picture_path,
          signature_photo: signature_photo_path,
        },
        { where: { user_id } }
      );

      if (updated_user[0] === 1) {
        return res.status(200).json({ status: message_constants.US });
      } else {
        return res.status(500).json({ error: message_constants.EWU });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};

// export const provider_onboarding_upload = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { user_id } = req.params;
//     const id = parseInt(user_id);
//     const uploaded_files: any = req.files || [];

//     const document_fields = [
//       {
//         fieldname: "independent_contractor_agreement",
//         pathName: "independent_contractor_agreement_path",
//       },
//       { fieldname: "background_check", pathName: "background_check_path" },
//       { fieldname: "HIPAA", pathName: "HIPAA_compliance_path" },
//       { fieldname: "non_diclosure", pathName: "non_diclosure_agreement_path" },
//       { fieldname: "licence_document", pathName: "licence_document_path" },
//     ];

//     const document_updates = document_fields.map(async (doc_field) => {
//       const document_path = uploaded_files.find(
//         (file: any) => file.fieldname === doc_field.fieldname
//       )?.path;
//       console.log(doc_field.fieldname);
//       if (document_path) {
//         const existingDocument = await Documents.findOne({
//           where: {
//             user_id,
//             document_name: doc_field.pathName,
//           },
//         });

//         if (!existingDocument) {
//           const status = await Documents.create({
//             user_id: id,
//             document_name: doc_field.pathName,
//             document_path: document_path,
//           });
//           console.log(status);
//         } else {
//           const status = await Documents.update(
//             { document_path: document_path },
//             { where: { user_id, document_name: doc_field.pathName } }
//           );
//           console.log(status);
//         }
//       }
//     });

//     await Promise.all(document_updates);

//     return res.status(200).json({ message: message_constants.UpS });
//   } catch (error) {
//     return res.status(500).json({ error: message_constants.ISE });
//   }
// };

export const provider_onboarding_upload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.body as { user_id: number };
    const user = await User.findOne({
      where: {
        user_id,
        type_of_user: "provider",
        role: "physician",
      },
    });
    if (!user) {
      return res.status(404).json({
        message: message_constants.UNF,
      });
    }
    const uploaded_files: any = req.files || [];

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
    const licence_document_path = uploaded_files.find(
      (file: any) => file.fieldname === "licence_document"
    )?.path;

    if (independent_contractor_agreement_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user_id,
          document_name: "independent_contractor_agreement",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: "independent_contractor_agreement",
          document_path: independent_contractor_agreement_path,
        });
      } else {
        Documents.update(
          { document_path: independent_contractor_agreement_path },
          {
            where: {
              user_id,
            },
          }
        );
      }
    }
    if (background_check_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user_id,
          document_name: "background_check",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: "background_check",
          document_path: background_check_path,
        });
      } else {
        Documents.update(
          { document_path: background_check_path },
          {
            where: {
              user_id,
            },
          }
        );
      }
    }
    if (HIPAA_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user_id,
          document_name: "HIPAA",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: "HIPAA",
          document_path: HIPAA_path,
        });
      } else {
        Documents.update(
          { document_path: HIPAA_path },
          {
            where: {
              user_id,
            },
          }
        );
      }
    }
    if (non_diclosure_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user_id,
          document_name: "non_diclosure",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: "non_diclosure",
          document_path: non_diclosure_path,
        });
      } else {
        Documents.update(
          { document_path: non_diclosure_path },
          {
            where: {
              user_id,
            },
          }
        );
      }
    }
    if (licence_document_path) {
      const document_status = await Documents.findOne({
        where: {
          user_id: user_id,
          document_name: "licence_document",
        },
      });
      if (!document_status) {
        await Documents.create({
          user_id,
          document_name: "licence_document",
          document_path: licence_document_path,
        });
      } else {
        Documents.update(
          { document_path: licence_document_path },
          {
            where: {
              user_id,
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
export const provider_onboarding_delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { document_id } = req.params;
    const delete_status = Documents.destroy({
      where: {
        document_id,
      },
    });
    if (!delete_status) {
      return res.status(200).json({ message: message_constants.EWDD });
    }
    return res.status(200).json({ message: message_constants.DS });
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE });
  }
};
