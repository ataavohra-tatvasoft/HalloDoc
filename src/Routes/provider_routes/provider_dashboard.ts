import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  active_state_encounter,
  conclude_state_conclude_care,
  conclude_state_conclude_care_upload,
  conclude_state_conclude_care_view,
  conclude_state_encounter_form,
  conclude_state_encounter_form_finalize,
  housecall,
  provider_accept_request,
  provider_requests_by_request_state_counts,
  requests_by_request_state_provider,
  save_view_notes_for_request_provider,
  transfer_request_provider,
  view_notes_for_request_provider,
} from "../../controllers";

import { authmiddleware } from "../../middlewares";
import {
  active_state_encounter_validation,
  conclude_state_conclude_care_upload_validation,
  conclude_state_conclude_care_validation,
  conclude_state_conclude_care_view_validation,
  conclude_state_encounter_form_finalize_validation,
  conclude_state_encounter_form_validation,
  housecall_validation,
  provider_accept_request_validation,
  requests_by_request_state_provider_validation,
  save_view_notes_for_request_provider_validation,
  transfer_request_provider_validation,
  view_notes_for_request_provider_validation,
} from "../../validations";
import { upload } from "../../utils";
const router: Router = express.Router();

/**                              Provider in Dashboard                                       */

router.get(
  "/dashboard/requests_count",
  authmiddleware,
  provider_requests_by_request_state_counts
);

router.get(
  "/dashboard/requests",
  authmiddleware,
  celebrate(requests_by_request_state_provider_validation),
  requests_by_request_state_provider
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/accept_request",
  authmiddleware,
  celebrate(provider_accept_request_validation),
  provider_accept_request
);

router.post(
  "/dashboard/requests/:confirmation_no/actions/transfer_request",
  authmiddleware,
  celebrate(transfer_request_provider_validation),
  transfer_request_provider
);

router.get(
  "/dashboard/requests/:confirmation_no/actions/view_notes",
  authmiddleware,
  celebrate(view_notes_for_request_provider_validation),
  view_notes_for_request_provider
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/save_view_notes",
  authmiddleware,
  celebrate(save_view_notes_for_request_provider_validation),
  save_view_notes_for_request_provider
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/encounter",
  authmiddleware,
  celebrate(active_state_encounter_validation),
  active_state_encounter
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/housecall",
  authmiddleware,
  celebrate(housecall_validation),
  housecall
);

router.get(
  "/dashboard/requests/:confirmation_no/actions/conclude_care_view",
  authmiddleware,
  celebrate(conclude_state_conclude_care_view_validation),
  conclude_state_conclude_care_view
);

router.post(
  "/dashboard/requests/:confirmation_no/actions/conclude_care_upload",
  authmiddleware,
  upload.single("file"),
  celebrate(conclude_state_conclude_care_upload_validation),
  conclude_state_conclude_care_upload
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/conclude_care",
  authmiddleware,
  celebrate(conclude_state_conclude_care_validation),
  conclude_state_conclude_care
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/encounter_form",
  authmiddleware,
  celebrate(conclude_state_encounter_form_validation),
  conclude_state_encounter_form
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/encounter_form_finalize",
  authmiddleware,
  celebrate(conclude_state_encounter_form_finalize_validation),
  conclude_state_encounter_form_finalize
);
export default router;
