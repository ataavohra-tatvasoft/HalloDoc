import { Request, Response, NextFunction } from "express";
import { Controller } from "../../interfaces/common_interface";
import User from "../../db/models/user";
import message_constants from "../../public/message_constants";
import RequestModel from "../../db/models/request";
import { Op } from "sequelize";
import Requestor from "../../db/models/requestor";
import Documents from "../../db/models/documents";
import bcrypt from "bcrypt";

export const is_patient_registered: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
      },
    });

    if (is_patient) {
      return res.status(200).json({
        message: message_constants.RP,
      });
    } else {
      return res.status(200).json({
        message: message_constants.PNR,
      });
    }
  } catch (error) {
    res.status(500).json({ error: message_constants.ISE });
  }
};

export const create_request_by_patient: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req);
    const file = req.file;
    // console.log(file);
    const {
      body: {
        symptoms,
        firstname,
        lastname,
        date_of_birth,
        email,
        mobile_no,
        street,
        city,
        state,
        zip,
        room,
        password,
      },
    } = req;

    // console.log(req.body);
    // console.log(email, password);

    const hashed_password = await bcrypt.hash(password, 10);

    const generate_confirmation_number = (
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

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
        
      },
    });

    let patient_data;

    console.log(is_patient);

    if (is_patient) {
      const update_status = await User.update(
        {
          firstname,
          lastname,
          mobile_no: BigInt(mobile_no),
          dob: new Date(date_of_birth),
          street,
          city,
          state,
          zip: Number(zip),
          address_1: room,
        },
        {
          where: {
            type_of_user: "patient",
            email,
          },
        }
      );
      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      patient_data = is_patient;
    } else {
      patient_data = await User.create({
        type_of_user: "patient",
        firstname,
        lastname,
        mobile_no: BigInt(mobile_no),
        email,
        dob: new Date(date_of_birth),
        street,
        city,
        state,
        zip: Number(zip),
        address_1: room,
        password: hashed_password,
      });

      if (!patient_data) {
        return res.status(400).json({
          status: false,
          message: message_constants.EWCA,
        });
      }
    }

    console.log("error_2 is here");

    const todays_requests_count: number = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${new Date().toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${new Date().toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = generate_confirmation_number(
      patient_data.state,
      firstname,
      lastname,
      todays_requests_count
    );

    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "patient",
      requested_date: new Date(),
      confirmation_no,
      notes_symptoms: symptoms,
    });

    if (!request_data) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCR,
      });
    }

    if (file) {
      const is_document = await Documents.findOne({
        where: {
          request_id: request_data.request_id,
        },
      });

      if (is_document) {
        const document_update = await Documents.update(
          {
            document_path: file.path,
          },
          {
            where: { request_id: request_data.request_id },
          }
        );

        if (!document_update) {
          return res.status(404).json({ error: message_constants.EWU });
        }
      } else {
        const new_document = await Documents.create({
          request_id: request_data.request_id,
          document_path: file.path,
        });

        if (!new_document) {
          return res.status(404).json({ error: message_constants.FTU });
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: message_constants.RC,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const create_request_by_family_friend: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;
    const {
      your_first_name,
      your_last_name,
      your_mobile_no,
      your_email,
      your_relation_with_patient,
      symptoms,
      firstname,
      lastname,
      date_of_birth,
      email,
      mobile_no,
      street,
      city,
      state,
      zip,
      room,
    } = req.body;

    const generate_confirmation_number = (
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

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
      },
    });

    let patient_data;

    if (is_patient) {
      const update_status = await User.update(
        {
          firstname,
          lastname,
          mobile_no,
          dob: new Date(date_of_birth),
          street,
          city,
          state,
          zip,
          address_1: room,
        },
        {
          where: {
            type_of_user: "patient",
            email,
          },
        }
      );
      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      patient_data = is_patient;
    } else {
      patient_data = await User.create({
        type_of_user: "patient",
        firstname,
        lastname,
        mobile_no,
        email,
        dob: new Date(date_of_birth),
        street,
        city,
        state,
        zip,
        address_1: room,
      });

      if (!patient_data) {
        return res.status(400).json({
          status: false,
          message: message_constants.EWCA,
        });
      }
    }

    const todays_requests_count: number = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${new Date().toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${new Date().toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = generate_confirmation_number(
      patient_data.state,
      firstname,
      lastname,
      todays_requests_count
    );

    const is_requestor = await Requestor.findOne({
      where: {
        email: your_email,
      },
    });
    let requestor;

    if (is_requestor) {
      requestor = await Requestor.update(
        {
          first_name: your_first_name,
          last_name: your_last_name,
          mobile_number: BigInt(your_mobile_no),
          email: your_email,
        },
        {
          where: {
            email: your_email,
          },
        }
      );
      if (!requestor) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    if (!is_requestor) {
      requestor = await Requestor.create({
        first_name: your_first_name,
        last_name: your_last_name,
        mobile_number: BigInt(your_mobile_no),
        email: your_email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!requestor) {
        return res.status(404).json({
          message: message_constants.ReNF,
        });
      }
    }

    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "family/friend",
      requestor_id: is_requestor?.user_id,
      requested_date: new Date(),
      confirmation_no,
      notes_symptoms: symptoms,
      relation_with_patient: your_relation_with_patient,
    });

    if (!request_data) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCR,
      });
    }

    if (file) {
      const is_document = await Documents.findOne({
        where: {
          request_id: request_data.request_id,
        },
      });

      if (is_document) {
        const document_update = await Documents.update(
          {
            document_path: file.path,
          },
          {
            where: { request_id: request_data.request_id },
          }
        );

        if (!document_update) {
          return res.status(404).json({ error: message_constants.EWU });
        }
      } else {
        const new_document = await Documents.create({
          request_id: request_data.request_id,
          document_path: file.path,
        });

        if (!new_document) {
          return res.status(404).json({ error: message_constants.FTU });
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: message_constants.RC,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const create_request_by_concierge: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      your_first_name,
      your_last_name,
      your_mobile_no,
      your_email,
      your_house_name,
      your_street,
      your_city,
      your_state,
      your_zip,
      symptoms,
      firstname,
      lastname,
      date_of_birth,
      state,
      email,
      mobile_no,
      room,
    } = req.body;

    console.log(req.body);

    const generate_confirmation_number = (
      state: string,
      firstname: string,
      lastname: string,
      todays_requests_count: number
    ): string => {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2); // Last 2 digits of year
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-padded month
      const day = String(today.getDate()).padStart(2, "0"); // 0-padded day
      console.log(state);
      return `${state.slice(0, 2)}${year}${month}${day}${lastname.slice(
        0,
        2
      )}${firstname.slice(0, 2)}${String(todays_requests_count + 1).padStart(
        4,
        "0"
      )}`;
    };

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
      },
    });

    let patient_data;

    if (is_patient) {
      const update_status = await User.update(
        {
          firstname,
          lastname,
          mobile_no,
          dob: new Date(date_of_birth),
          address_1: room,
          state,
        },
        {
          where: {
            type_of_user: "patient",
            email,
          },
        }
      );
      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      patient_data = is_patient;
    } else {
      patient_data = await User.create({
        type_of_user: "patient",
        firstname,
        lastname,
        mobile_no,
        email,
        state,
        dob: new Date(date_of_birth),
        address_1: room,
      });

      if (!patient_data) {
        return res.status(400).json({
          status: false,
          message: message_constants.EWCA,
        });
      }
    }
    // console.log(patient_data);
    const todays_requests_count: number = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${new Date().toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${new Date().toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    console.log(todays_requests_count);

    const confirmation_no = generate_confirmation_number(
      patient_data.state,
      firstname,
      lastname,
      todays_requests_count
    );

    const is_requestor = await Requestor.findOne({
      where: {
        email: your_email,
      },
    });
    let requestor;

    if (is_requestor) {
      requestor = await Requestor.update(
        {
          first_name: your_first_name,
          last_name: your_last_name,
          mobile_number: BigInt(your_mobile_no),
          email: your_email,
          house_name: your_house_name,
          street: your_street,
          city: your_city,
          state: your_state,
          zip: Number(your_zip),
        },
        {
          where: {
            email: your_email,
          },
        }
      );
      if (!requestor) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    if (!is_requestor) {
      requestor = await Requestor.create({
        first_name: your_first_name,
        last_name: your_last_name,
        mobile_number: BigInt(your_mobile_no),
        email: your_email,
        house_name: your_house_name,
        street: your_street,
        city: your_city,
        state: your_state,
        zip: Number(your_zip),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!requestor) {
        return res.status(404).json({
          message: message_constants.ReNF,
        });
      }
    }

    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "concierge",
      requestor_id: is_requestor?.user_id,
      requested_date: new Date(),
      confirmation_no,
      notes_symptoms: symptoms,
    });

    if (!request_data) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCR,
      });
    }

    return res.status(200).json({
      status: true,
      message: message_constants.RC,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};

export const create_request_by_business: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      your_first_name,
      your_last_name,
      your_mobile_no,
      your_email,
      your_property_name,
      symptoms,
      firstname,
      lastname,
      date_of_birth,
      email,
      mobile_no,
      street,
      city,
      state,
      zip,
      room,
    } = req.body;

    const generate_confirmation_number = (
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

    const is_patient = await User.findOne({
      where: {
        type_of_user: "patient",
        email,
      },
    });

    let patient_data;

    if (is_patient) {
      const update_status = await User.update(
        {
          firstname,
          lastname,
          mobile_no,
          dob: new Date(date_of_birth),
          email,
          street,
          city,
          state,
          zip,
          address_1: room,
        },
        {
          where: {
            type_of_user: "patient",
            email,
          },
        }
      );
      if (!update_status) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
      patient_data = is_patient;
    } else {
      patient_data = await User.create({
        type_of_user: "patient",
        firstname,
        lastname,
        mobile_no,
        email,
        dob: new Date(date_of_birth),
        street,
        city,
        state,
        zip,
        address_1: room,
      });

      if (!patient_data) {
        return res.status(400).json({
          status: false,
          message: message_constants.EWCA,
        });
      }
    }

    const todays_requests_count: number = await RequestModel.count({
      where: {
        createdAt: {
          [Op.gte]: `${new Date().toISOString().split("T")[0]}`, // Since midnight today
          [Op.lt]: `${new Date().toISOString().split("T")[0]}T23:59:59.999Z`, // Until the end of today
        },
      },
    });

    const confirmation_no = generate_confirmation_number(
      patient_data.state,
      firstname,
      lastname,
      todays_requests_count
    );

    const is_requestor = await Requestor.findOne({
      where: {
        email: your_email,
      },
    });
    let requestor;

    if (is_requestor) {
      requestor = await Requestor.update(
        {
          first_name: your_first_name,
          last_name: your_last_name,
          mobile_number: BigInt(your_mobile_no),
          email: your_email,
          house_name: your_property_name,
        },
        {
          where: {
            email: your_email,
          },
        }
      );
      if (!requestor) {
        return res.status(500).json({
          message: message_constants.EWU,
        });
      }
    }

    if (!is_requestor) {
      requestor = await Requestor.create({
        first_name: your_first_name,
        last_name: your_last_name,
        mobile_number: BigInt(your_mobile_no),
        email: your_email,
        house_name: your_property_name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!requestor) {
        return res.status(404).json({
          message: message_constants.ReNF,
        });
      }
    }

    const request_data = await RequestModel.create({
      request_state: "new",
      patient_id: patient_data.user_id,
      requested_by: "business",
      requestor_id: is_requestor?.user_id,
      requested_date: new Date(),
      confirmation_no,
      notes_symptoms: symptoms,
    });

    if (!request_data) {
      return res.status(400).json({
        status: false,
        message: message_constants.EWCR,
      });
    }

    return res.status(200).json({
      status: true,
      message: message_constants.RC,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message_constants.ISE });
  }
};
