import multer, { diskStorage } from "multer";
import nodemailer from "nodemailer";
import path from "path";
import Region from "../db/models/region";
import UserRegionMapping from "../db/models/user-region_mapping";
import message_constants from "../public/message_constants";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";
import Documents from "../db/models/documents";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  debug: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..") + "\\src\\public\\uploads"); // Adjust as needed
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-";
    const ext = path.extname(file.originalname); // Extract extension
    cb(null, uniqueSuffix + ext);
  },
});
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ];
    const extname = file.mimetype.toLowerCase();
    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PNG,PDF, JPG, and JPEG files are allowed."
        )
      );
    }
  },
});

export const update_region_mapping = async (
  user_id: number,
  region_ids: Array<number>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delete_where = {
    user_id: user_id,
    region_id: {
      [Op.notIn]: region_ids,
    },
  };

  for (const region of region_ids) {
    const region_data = await Region.findOne({
      where: {
        region_id: region,
      },
    });

    if (!region_data) {
      return console.log("message:", message_constants.RegNF);
    }

    const is_exist = await UserRegionMapping.findOne({
      where: {
        user_id: user_id,
        region_id: region_data.region_id,
      },
    });

    if (is_exist) {
      const mapping = await UserRegionMapping.update(
        {
          user_id: user_id,
          region_id: region_data?.region_id,
        },
        {
          where: {
            user_id: user_id,
            region_id: region_data?.region_id,
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
        user_id: user_id,
        region_id: region_data?.region_id,
      });

      if (!mapping) {
        return console.log("message:", message_constants.EWC);
      }
    }
  }

  const deleted_mappings = await UserRegionMapping.destroy({
    where: delete_where,
  });

  if (deleted_mappings === 0) {
    return console.log("No region mappings deleted");
  } else {
    return console.log(`${deleted_mappings} region mappings deleted`);
  }
};
// Function to send email with attachment
export async function send_email_with_attachment(
  email: string,
  file_path: string,
  filename: string
) {
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
    to: email,
    subject: "Requested Documents",
    text: "Please find the requested documents attached.",
    attachments: [
      {
        filename: filename,
        path: file_path,
      },
    ],
  });

  if (!info) {
    throw new Error("Error sending email");
  }
}

export const update_document = async (
  user_id: number,
  document_name: string,
  document_path: string
) => {
  if (!document_path) return;
  const document_status = await Documents.findOne({
    where: { user_id, document_name },
  });
  if (!document_status) {
    await Documents.create({ user_id, document_name, document_path });
  } else {
    await Documents.update(
      { document_path },
      { where: { user_id, document_name } }
    );
  }
};

export const generate_confirmation_number = (
  state: string,
  firstname: string,
  lastname: string,
  todays_requests_count: number
): string => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
  const day = String(today.getDate()).padStart(2, "0"); // 0-padded day
  return `${state.slice(0, 2)}${year}${month}${day}${lastname.slice(
    0,
    2
  )}${firstname.slice(0, 2)}${String(todays_requests_count + 1).padStart(
    4,
    "0"
  )}`;
};