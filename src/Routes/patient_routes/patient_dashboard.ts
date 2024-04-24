import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { medical_history, request_action_document } from "../../controllers";
import {
  medical_history_validation,
  request_action_document_validation,
} from "../../validations/index";
const router: Router = express.Router();

router.get(
  "/dashboard/medical_history",
  celebrate(medical_history_validation),
  medical_history
);

router.get(
  "/dashboard/request/:confirmation_no/view_documents",
  celebrate(request_action_document_validation),
  request_action_document
);

export default router;
