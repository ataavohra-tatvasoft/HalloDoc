import express, { Router } from "express";
import {
  provider_myprofile_onboarding_delete,
  provider_myprofile_onboarding_upload,
  provider_myprofile_onboarding_view,
  provider_profile_reset_password,
  provider_profile_view,
  provider_provider_profile_upload,
  provider_request_to_admin,
  provider_request_to_admin_refactored,
} from "../../controllers";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";
import {
  provider_myprofile_onboarding_delete_validation,
  provider_myprofile_onboarding_upload_validation,
  provider_myprofile_onboarding_view_validation,
  provider_profile_reset_password_validation,
  provider_provider_profile_upload_validation,
  provider_request_to_admin_validation,
} from "../../validations";
import { upload } from "../../utils";

const router: Router = express.Router();

/**Provider/Physician in My Profile */

router.get(
  "/myprofile/provider_profile/view",
  authmiddleware,
  provider_profile_view
);

router.put(
  "/myprofile/provider_profile/resetpassword",
  authmiddleware,
  celebrate(provider_profile_reset_password_validation),
  provider_profile_reset_password
);

router.put(
  "/myprofile/provider_profile/profile_upload",
  authmiddleware,
  upload.any(),
  // celebrate(provider_provider_profile_upload_validation),
  provider_provider_profile_upload
);

router.put(
  "/myprofile/provider_profile/request_to_admin",
  authmiddleware,
  celebrate(provider_request_to_admin_validation),
  // provider_request_to_admin,
  provider_request_to_admin_refactored
);

router.put(
  "/myprofile/onboarding/upload",
  authmiddleware,
  upload.any(),
  // celebrate(provider_myprofile_onboarding_upload_validation),
  provider_myprofile_onboarding_upload
);

router.get(
  "/myprofile/onboarding/view",
  authmiddleware,
  celebrate(provider_myprofile_onboarding_view_validation),
  provider_myprofile_onboarding_view
);

router.delete(
  "/myprofile/onboarding/:document_id/delete",
  authmiddleware,
  // celebrate(provider_myprofile_onboarding_delete_validation),
  provider_myprofile_onboarding_delete
);

export default router;
