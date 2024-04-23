import multer, { diskStorage } from "multer";
import nodemailer from "nodemailer";
import path from "path";
import Region from "../db/models/region";
import UserRegionMapping from "../db/models/user-region_mapping";

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
    cb(null, path.join(__dirname, "..", "..", "..") + "\\src\\public\\uploads"); // Adjust as needed
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
  region_name: string,
  value: boolean
) => {
  const region = await Region.findOne({
    where: { region_name },
    attributes: ["region_id"],
  });

  if (!region) {
    return;
  }

  const is_exist = await UserRegionMapping.findOne({
    where: { user_id, region_id: region.region_id },
  });

  if (+value) {
    if (is_exist) {
      console.log("update");
      await UserRegionMapping.update(
        { user_id, region_id: region.region_id },
        { where: { user_id, region_id: region.region_id } }
      );
    } else {
      console.log("create");
      await UserRegionMapping.create({ user_id, region_id: region.region_id });
    }
  } else {
    if (is_exist) {
      console.log("delete");
      await UserRegionMapping.destroy({
        where: { user_id, region_id: region.region_id },
      });
    }
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
