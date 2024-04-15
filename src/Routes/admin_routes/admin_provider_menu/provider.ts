import express, { Router } from "express";
import {
  provider_list,
  stop_notification,
  contact_provider,
  view_edit_physician_account,
  physician_account_reset_password,
  save_user_information,
  save_account_information,
  save_physician_information,
  save_mailing_billing_info,
  save_provider_profile,
  delete_provider_account,
  provider_profile_upload,
  provider_onboarding_upload,
  provider_onboarding_delete,
  create_provider_account_refactored,
  common_save_provider_account,
} from "../../../controllers";
import {
  provider_list_validation,
  stop_notification_validation,
  contact_provider_validation,
  view_edit_physician_account_validation,
  physician_account_reset_password_validation,
  save_user_information_validation,
  save_account_information_validation,
  save_physician_information_validation,
  save_mailing_billing_info_validation,
  save_provider_profile_validation,
  delete_provider_account_validation,
  provider_profile_upload_validation,
  provider_onboarding_upload_validation,
  provider_onboarding_delete_validation,
  create_provider_account_refactored_validation,
} from "../../../validations";
import { authmiddleware } from "../../../middlewares";
import { upload } from "../../../utils";
import { celebrate, Joi } from "celebrate";

const router: Router = express.Router();

/**                             Admin in Provider Menu                                    */

router.get(
  "/providermenu/provider_list",
  authmiddleware,
  celebrate(provider_list_validation),
  provider_list
);
router.put(
  "/providermenu/provider_list/stop_notification",
  authmiddleware,
  celebrate(stop_notification_validation),
  stop_notification
);
router.post(
  "/providermenu/provider_list/:user_id/contact_provider",
  authmiddleware,
  celebrate(contact_provider_validation),
  contact_provider
);
router.get(
  "/providermenu/provider_list/:user_id/view_edit_physician_account",
  authmiddleware,
  celebrate(view_edit_physician_account_validation),
  view_edit_physician_account
);
router.put(
  "/providermenu/provider_list/physician_account_reset_password",
  authmiddleware,
  celebrate(physician_account_reset_password_validation),
  physician_account_reset_password
);

router.put(
  "/providermenu/provider_list/save_user_information",
  authmiddleware,
  celebrate(save_user_information_validation),
  save_user_information
);
//Combined below four routes into above one
router.put(
  "/providermenu/provider_list/save_account_information",
  authmiddleware,
  celebrate(save_account_information_validation),
  save_account_information
);
router.put(
  "/providermenu/provider_list/save_physician_information",
  authmiddleware,
  celebrate(save_physician_information_validation),
  save_physician_information
);
router.put(
  "/providermenu/provider_list/save_mailing_billing_info",
  authmiddleware,
  celebrate(save_mailing_billing_info_validation),
  save_mailing_billing_info
);
router.put(
  "/providermenu/provider_list/save_provider_profile",
  authmiddleware,
  celebrate(save_provider_profile_validation),
  save_provider_profile
);

router.delete(
  "/providermenu/provider_list/:user_id/delete_provider_account",
  authmiddleware,
  celebrate(delete_provider_account_validation),
  delete_provider_account
);
router.put(
  "/providermenu/provider_list/:user_id/provider_profile_upload",
  authmiddleware,
  // celebrate(provider_profile_upload_validation),
  upload.any(),
  provider_profile_upload
);
router.put(
  "/providermenu/provider_list/provider_onboarding_upload",
  authmiddleware,
  // celebrate(provider_onboarding_upload_validation),
  upload.any(),
  provider_onboarding_upload
);
router.delete(
  "/providermenu/provider_list/:document_id/provider_onboarding_delete",
  authmiddleware,
  celebrate(provider_onboarding_delete_validation),
  provider_onboarding_delete
);
router.post(
  "/providermenu/provider_list/create_provider_account",
  authmiddleware,
  // celebrate(create_provider_account_refactored_validation),
  upload.any(),
  create_provider_account_refactored
);

router.put(
  "/providermenu/provider_list/common_save_provider_account",
  authmiddleware,
  // celebrate(create_provider_account_refactored_validation),
  upload.any(),
  common_save_provider_account
);

export default router;
