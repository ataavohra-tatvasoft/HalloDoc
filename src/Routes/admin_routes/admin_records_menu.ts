import express, { Router } from "express";
import {
  patient_history,
  patient_records,
  patient_records_view_documents,
  patient_records_view_case,
  search_records,
  search_record_delete,
  logs_history,
  cancel_and_block_history,
  block_history_unblock,
} from "../../controllers";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";
import {
  patient_history_validation,
  patient_records_validation,
  patient_records_view_documents_validation,
  patient_records_view_case_validation,
  search_records_validation,
  search_record_delete_validation,
  logs_history_validation,
  cancel_and_block_history_validation,
  block_history_unblock_validation,
} from "../../validations";

const router: Router = express.Router();

/**Admin in Records */

router.get(
  "/records/patienthistory",
  authmiddleware,
  celebrate(patient_history_validation),
  patient_history
);

router.get(
  "/records/patient_records",
  authmiddleware,
  celebrate(patient_records_validation),
  patient_records
);
router.get(
  "/records/:confirmation_no/patient_records_view_documents",
  authmiddleware,
  celebrate(patient_records_view_documents_validation),
  patient_records_view_documents
);
router.get(
  "/records/:confirmation_no/patient_records_view_case",
  authmiddleware,
  celebrate(patient_records_view_case_validation),
  patient_records_view_case
);

router.get(
  "/records/search_records",
  authmiddleware,
  celebrate(search_records_validation),
  search_records
);

//Below gives foreign key constraint
router.delete(
  "/records/:confirmation_no/search_records_delete",
  authmiddleware,
  celebrate(search_record_delete_validation),
  search_record_delete
);

router.get(
  "/records/logs",
  authmiddleware,
  celebrate(logs_history_validation),
  logs_history
);

router.get(
  "/records/cancel_block_history",
  authmiddleware,
  celebrate(cancel_and_block_history_validation),
  cancel_and_block_history
);

router.put(
  "/records/:confirmation_no/block_history_unblock",
  authmiddleware,
  celebrate(block_history_unblock_validation),
  block_history_unblock
);

export default router;
