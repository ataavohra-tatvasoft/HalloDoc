import express, { Router } from "express";
import {
  provider_profile_reset_password,
  provider_profile_view,
  provider_provider_profile_upload,
  provider_request_to_admin,
} from "../../controllers";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";
import { provider_profile_reset_password_validation, provider_provider_profile_upload_validation, provider_request_to_admin_validation } from "../../validations";
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
  provider_request_to_admin
);

export default router;
