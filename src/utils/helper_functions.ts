import multer, { diskStorage } from "multer";
import nodemailer from "nodemailer";
import path from "path";
import Region from "../db/models/region";
import RequestModel from "../db/models/request";
import Requestor from "../db/models/requestor";
import Notes from "../db/models/notes";
import Shifts from "../db/models/shifts";
import UserRegionMapping from "../db/models/user-region_mapping";
import message_constants from "../public/message_constants";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";
import Documents from "../db/models/documents";
import EncounterForm from "../db/models/encounter_form";
import { FormattedResponse } from "../interfaces/common_interface";
import User from "../db/models/user";

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
export const send_email_with_attachment = async (
  email: string,
  file_path: string,
  filename: string
) => {
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
};

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

export const handle_request_state = async (
  res: Response,
  state: string,
  search: string,
  region: string,
  requestor: string,
  page: string,
  page_size: string,
  additionalAttributes?: Array<string>
) => {
  console.log(state);
  const page_number = Number(page) || 1;
  const limit = Number(page_size) || 10;
  const offset = (page_number - 1) * limit;
  const formatted_response: FormattedResponse<any> = {
    status: true,
    data: [],
  };
  const where_clause_patient = {
    type_of_user: "patient",
    ...(search && {
      [Op.or]: [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
      ],
    }),
  };

  const { rows: requests } = await RequestModel.findAndCountAll({
    where: {
      request_state: state,
      ...(region && { state: region }),
      request_status: {
        [Op.notIn]:
          state === "toclose"
            ? ["cancelled by provider", "blocked", "clear"]
            : [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
      },
      ...(requestor && { requested_by: requestor }),
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
      "street",
      "city",
      "state",
      "zip",
      ...(additionalAttributes || []),
    ],
    include: [
      {
        as: "Patient",
        model: User,
        where: where_clause_patient,
      },
      ...(state !== "new"
        ? [
            {
              as: "Physician",
              model: User,
              where: {
                type_of_user: "physician",
              },
              required: false, // Make physician association optional
            },
          ]
        : []),
      {
        model: Requestor,
      },
      {
        model: Notes,
      },
    ],
    limit,
    offset,
  });

  const { count } = await RequestModel.findAndCountAll({
    where: {
      request_state: state,
      ...(region && { state: region }),
      request_status: {
        [Op.notIn]:
          state === "toclose"
            ? ["cancelled by provider", "blocked", "clear"]
            : [
                "cancelled by admin",
                "cancelled by provider",
                "blocked",
                "clear",
              ],
      },
      ...(requestor && { requested_by: requestor }),
    },
    include: [
      {
        as: "Patient",
        model: User,
        where: where_clause_patient,
      },
      ...(state !== "new"
        ? [
            {
              as: "Physician",
              model: User,
              where: {
                type_of_user: "physician",
              },
              required: false,
            },
          ]
        : []),
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
      confirmation_no: request.confirmation_no,
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
        user_id: request?.Patient?.user_id || null,
        name: request?.Patient?.firstname + " " + request?.Patient?.lastname,
        DOB: request?.Patient?.dob?.toISOString().split("T")[0],
        mobile_no: request?.Patient?.mobile_no || null,
        address: request?.street + " " + request?.city + " " + request?.state,
        ...(state === "toclose"
          ? { region: request?.Patient?.state || null }
          : {}),
      },
      ...(state !== "new"
        ? {
            physician_data: {
              user_id: request?.Physician?.user_id || null,
              name:
                request?.Physician?.firstname +
                " " +
                request?.Physician?.lastname,
              DOB: request?.Physician?.dob?.toISOString().split("T")[0] || null,
              mobile_no: request?.Physician?.mobile_no || null,
              address:
                request?.Physician?.address_1 ||
                null + " " + request?.Physician?.address_2 ||
                null + " " + request?.Physician?.state ||
                null,
            },
          }
        : {}),
      requestor_data: {
        user_id: request?.Requestor?.user_id || null,
        first_name:
          request?.Requestor?.first_name ||
          null + " " + request?.Requestor?.last_name ||
          null,
        last_name: request?.Requestor?.last_name || null,
      },
      notes: request?.Notes?.map((note) => ({
        note_id: note?.note_id || null,
        type_of_note: note?.type_of_note || null,
        description: note?.description || null,
      })),
    };
    i++;
    formatted_response.data.push(formatted_request);
  }

  return res.status(200).json({
    ...formatted_response,
    total_pages: Math.ceil(count / limit),
    current_page: page_number,
    total_count: count,
  });
};

export const handle_request_state_exports = async (
  state: string,
  search: string,
  region: string,
  requestor: string,
  page: string,
  page_size: string,
  additional_attributes?: any
) => {
  const page_number = Number(page) || 1;
  const limit = Number(page_size) || 100;
  const offset = (page_number - 1) * limit;
  const where_clause_patient = {
    type_of_user: "patient",
    ...(search && {
      [Op.or]: [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
      ],
    }),
  };
  const formatted_response: FormattedResponse<any> = {
    status: true,
    data: [],
  };
  const { count, rows: requests } = await RequestModel.findAndCountAll({
    where: {
      request_state: state,
      ...(region && { state: region }),
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
      "street",
      "city",
      "state",
      "zip",
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
        address: request?.street + " " + request?.city + " " + request?.state,
        ...(state === "toclose" ? { region: request.Patient.state } : {}),
      },
      ...(state !== "new"
        ? {
            physician_data: {
              user_id: request.Physician.user_id,
              name:
                request.Physician.firstname + " " + request.Physician.lastname,
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

export const handle_request_state_physician = async (
  user_id: number,
  res: Response,
  state: string,
  search: string,
  region: string,
  requestor: string,
  page: string,
  page_size: string,
  additionalAttributes?: Array<string>
) => {
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
  };
  const formatted_response: FormattedResponse<any> = {
    status: true,
    data: [],
  };
  const { count, rows: requests } = await RequestModel.findAndCountAll({
    where: {
      request_state: state,
      physician_id: user_id,
      ...(region && { state: region }),
      ...(requestor ? { requested_by: requestor } : {}),
    },
    attributes: [
      "request_id",
      "request_state",
      "confirmation_no",
      "requested_by",
      "request_status",
      "physician_id",
      "patient_id",
      "street",
      "city",
      "state",
      "zip",
      ...(additionalAttributes || []),
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
      {
        model: Requestor,
        attributes: ["user_id", "first_name", "last_name"],
      },
    ],
    limit,
    offset,
  });

  var i = offset + 1;
  for (const request of requests) {
    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    const formatted_request = {
      sr_no: i,
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      requestor: request.requested_by,
      request_status: request.request_status,
      is_finalized: encounter_form?.is_finalize || false,
      patient_data: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
        mobile_no: request.Patient.mobile_no,
        address: request?.street + " " + request?.city + " " + request?.state,
        ...(state == "active"
          ? {
              status: request.Patient.status,
            }
          : {}),
      },

      requestor_data: {
        user_id: request.Requestor?.user_id || null,
        first_name:
          request.Requestor?.first_name ||
          null + " " + request.Requestor?.last_name ||
          null,
        last_name: request.Requestor?.last_name || null,
      },
    };
    i++;
    formatted_response.data.push(formatted_request);
  }

  return res.status(200).json({
    ...formatted_response,
    total_pages: Math.ceil(count / limit),
    current_page: page_number,
    total_count: count,
  });
};

export const handle_request_state_physician_exports = async (
  user_id: number,
  state: string,
  search: string,
  region: string,
  requestor: string,
  page: string,
  page_size: string,
  additionalAttributes?: Array<string>
) => {
  const page_number = Number(page) || 1;
  const limit = Number(page_size) || 100;
  const offset = (page_number - 1) * limit;

  const where_clause_patient = {
    type_of_user: "patient",
    ...(search && {
      [Op.or]: [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
      ],
    }),
  };
  const formatted_response: FormattedResponse<any> = {
    status: true,
    data: [],
  };
  const { count, rows: requests } = await RequestModel.findAndCountAll({
    where: {
      request_state: state,
      physician_id: user_id,
      ...(region && { state: region }),
      ...(requestor ? { requested_by: requestor } : {}),
    },
    attributes: [
      "request_id",
      "request_state",
      "confirmation_no",
      "requested_by",
      "request_status",
      "physician_id",
      "patient_id",
      "street",
      "city",
      "state",
      "zip",
      ...(additionalAttributes || []),
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
      {
        model: Requestor,
        attributes: ["user_id", "first_name", "last_name"],
      },
    ],
    limit,
    offset,
  });

  var i = offset + 1;
  for (const request of requests) {
    const encounter_form = await EncounterForm.findOne({
      where: {
        request_id: request.request_id,
      },
    });
    const formatted_request = {
      sr_no: i,
      request_id: request.request_id,
      request_state: request.request_state,
      confirmation_no: request.confirmation_no,
      requestor: request.requested_by,
      request_status: request.request_status,
      is_finalized: encounter_form?.is_finalize || false,
      patient_data: {
        user_id: request.Patient.user_id,
        name: request.Patient.firstname + " " + request.Patient.lastname,
        mobile_no: request.Patient.mobile_no,
        address: request?.street + " " + request?.city + " " + request?.state,
        ...(state == "active"
          ? {
              status: request.Patient.status,
            }
          : {}),
      },

      requestor_data: {
        user_id: request.Requestor?.user_id || null,
        first_name:
          request.Requestor?.first_name ||
          null + " " + request.Requestor?.last_name ||
          null,
        last_name: request.Requestor?.last_name || null,
      },
    };
    i++;
    formatted_response.data.push(formatted_request);
  }

  return formatted_response;
};

export const repeat_days_shift = async (
  user_id: number,
  region: string,
  physician: string,
  shift_date: Date,
  start: string,
  end: string,
  repeat_days: string,
  repeat_end: number,
  res: Response
) => {
  const shift = await Shifts.create({
    user_id,
    region,
    physician,
    shift_date,
    start,
    end,
    repeat_days: "",
    repeat_end,
  });

  if (!shift) {
    return res.status(500).json({
      message: message_constants.EWCS,
    });
  }

  if (repeat_end === 0) {
    return "No extra shifts created (repeat end is zero)";
  }

  const weekdays = repeat_days.split(",");
  console.log(weekdays);

  // Optional validation (comment out if not needed)

  // const validWeekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  // const invalidDays = weekdays.filter(day => !validWeekdays.includes(day.toLowerCase()));
  // if (invalidDays.length > 0) {
  //   return `Invalid weekdays provided: ${invalidDays.join(', ')}`;
  // }
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  for (const day of weekdays) {
    let currentShiftDate = new Date(shift_date); // Copy for each iteration

    for (let i = 0; i < repeat_end; i++) {
      // Find the next desired weekday
      // console.log(currentShiftDate.getDay() + "->" + currentShiftDate);
      // console.log(days.indexOf(day.toLowerCase()) + "->" + day);

      while (currentShiftDate.getDay() !== days.indexOf(day.toLowerCase())) {
        currentShiftDate.setDate(currentShiftDate.getDate() + 1);
      }
      // console.log(currentShiftDate.getDay() + "->" + currentShiftDate);
      // console.log(days.indexOf(day.toLowerCase()) + "->" + day);

      const shift = await Shifts.create({
        user_id,
        region,
        physician,
        shift_date: currentShiftDate,
        start,
        end,
        repeat_days: "", // No further repetition
        repeat_end: 0, // Create one shift per iteration
      });

      if (!shift) {
        return `Error creating shift for ${day}`;
      }

      // Skip to next instance of the same weekday (considering weekly cycle)
      let daysToSkip = (days.length - days.indexOf(day)) % 7; // Adjust for remaining days in the week
      if (daysToSkip == 0) {
        daysToSkip = 7;
      }
      currentShiftDate.setDate(currentShiftDate.getDate() + daysToSkip);
    }
  }

  const totalShifts = repeat_end * weekdays.length;
  return `Total shifts created: ${totalShifts}`;
};

export function manage_shift_in_time(
  shift: any,
  time_zone?: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!shift || !shift.shift_date || !shift.start || !shift.end) {
        throw new Error("Missing required shift data.");
      }

      const shift_date = new Date(shift.shift_date);

      // Adjust for time zone if provided
      if (time_zone) {
        shift_date.setUTCHours(
          shift_date.getUTCHours() + new Date().getTimezoneOffset() / (60 * 60)
        ); // Convert to UTC and then adjust based on provided time zone
      }

      const start_time = new Date(shift_date.getTime());
      const start_hours = Number(shift.start.split(":")[0]);
      const start_minutes = Number(shift.start.split(":")[1]);
      start_time.setHours(start_hours, start_minutes, 0); // Set time from string

      const endTime = new Date(shift_date.getTime());
      const end_hours = Number(shift.end.split(":")[0]);
      const end_minutes = Number(shift.end.split(":")[1]);
      endTime.setHours(end_hours, end_minutes, 0); // Set time from string

      const completion_time = endTime.getTime(); // Get timestamp in milliseconds

      console.log(typeof start_time);
      const start_time_string = String(start_time);
      console.log(typeof start_time_string);

      function compare_times(timeString: string): "future" | "past" | "same" {
        // Parse the time string into a Date object
        const parsed_time = new Date(timeString);

        // Get the current time
        const now = new Date();

        // Compare the times in milliseconds
        const comparison_result = parsed_time.getTime() - now.getTime();

        if (comparison_result > 0) {
          return "future";
        } else if (comparison_result < 0) {
          return "past";
        } else {
          return "same";
        }
      }

      const comparison_result = compare_times(start_time_string);

      if (comparison_result === "future") {
        console.log("The time string is in the future.");
      } else if (comparison_result === "past") {
        console.log("The time string is in the past.");
      } else {
        await User.update(
          { on_call_status: "scheduled" },
          { where: { user_id: shift.user_id } }
        );
        console.log(
          'User status updated to "scheduled" for shift:',
          shift.shift_id
        );
      }

      // Schedule user status update after completion
      setTimeout(async () => {
        try {
          await User.update(
            { on_call_status: "un-scheduled" },
            { where: { user_id: shift.user_id } }
          );
          console.log(
            'User status updated to "un-scheduled" for shift:',
            shift.shift_id
          );
        } catch (error) {
          console.error("Error updating user status:", error);
        }
      }, completion_time - Date.now()); // Calculate delay until completion

      resolve(); // Promise resolved successfully
    } catch (error) {
      reject(error); // Promise rejected with error
    }
  });
}
