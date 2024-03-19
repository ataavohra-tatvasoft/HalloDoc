import express, { Router } from "express";
import {
  provider_list,
  stop_notification,
  contact_provider,
  view_edit_physician_account,
  physician_account_reset_password,
  save_account_information,
  save_physician_information,
  save_mailing_billing_info,
  save_provider_profile,
  delete_provider_account,
  provider_profile_upload,
  provider_onboarding_upload,
  provider_onboarding_delete,
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import { upload } from "../../utils";

const router: Router = express.Router();

/**                             Admin in Provider Menu                                    */

router.get("/providermenu/provider_list", authmiddleware, provider_list);
router.put(
  "/providermenu/provider_list/:user_id/stop_notification",
  authmiddleware,
  stop_notification
);
router.post(
  "/providermenu/provider_list/:user_id/contact_provider",
  authmiddleware,
  contact_provider
);
router.get(
  "/providermenu/provider_list/:user_id/view_edit_physician_account",
  authmiddleware,
  view_edit_physician_account
);
router.put(
  "/providermenu/provider_list/physician_account_reset_password",
  authmiddleware,
  physician_account_reset_password
);
router.put(
  "/providermenu/provider_list/save_account_information",
  authmiddleware,
  save_account_information
);
router.put(
  "/providermenu/provider_list/save_physician_information",
  authmiddleware,
  save_physician_information
);
router.put(
  "/providermenu/provider_list/save_mailing_billing_info",
  authmiddleware,
  save_mailing_billing_info
);
router.put(
  "/providermenu/provider_list/save_provider_profile",
  authmiddleware,
  save_provider_profile
);
router.delete(
  "/providermenu/provider_list/:user_id/delete_provider_account",
  authmiddleware,
  delete_provider_account
);
router.put(
  "/providermenu/provider_list/:user_id/provider_profile_upload",
  authmiddleware,
  upload.any(),
  provider_profile_upload
);
router.put(
  "/providermenu/provider_list/:user_id/provider_onboarding_upload",
  authmiddleware,
  upload.any(),
  provider_onboarding_upload
);
router.delete(
  "/providermenu/provider_list/:document_id/provider_onboarding_delete",
  authmiddleware,
  provider_onboarding_delete
);

export default router;
