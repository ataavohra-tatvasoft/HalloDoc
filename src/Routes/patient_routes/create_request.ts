import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  create_request_by_business,
  create_request_by_concierge,
  create_request_by_family_friend,
  create_request_by_patient,
  is_patient_registered,
} from "../../controllers";
import {
  create_request_by_business_validation,
  create_request_by_concierge_validation,
  create_request_by_family_friend_validation,
  create_request_by_patient_validation,
  is_patient_registered_validation,
} from "../../validations/index";
import { upload } from "../../utils";
const router: Router = express.Router();

router.post(
  "/create_request/is_patient_registered",
  celebrate(is_patient_registered_validation),
  is_patient_registered
);

router.post(
  "/create_request/create_request_by_patient",
  upload.single("file"),
  celebrate(create_request_by_patient_validation),
  create_request_by_patient
);

router.post(
  "/create_request/create_request_by_family_friend",
  upload.single("file"),
  celebrate(create_request_by_family_friend_validation),
  create_request_by_family_friend
);

router.post(
  "/create_request/create_request_by_concierge",
  celebrate(create_request_by_concierge_validation),
  create_request_by_concierge
);

router.post(
  "/create_request/create_request_by_business",
  celebrate(create_request_by_business_validation),
  create_request_by_business
);

export default router;
