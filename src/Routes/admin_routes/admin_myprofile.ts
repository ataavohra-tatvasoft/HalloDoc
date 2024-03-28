import express, { Router } from "express";
import {
  admin_profile_view,
  admin_profile_reset_password,
  admin_profile_edit,
  admin_profile_admin_info_edit,
  admin_profile_mailing_billling_info_edit,
} from "../../controllers";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";
import {
  admin_profile_reset_password_validation_schema,
  admin_profile_edit_validation_schema,
  admin_profile_admin_info_edit_validation,
  admin_profile_mailing_billling_info_edit_validation,
} from "../../validations";

const router: Router = express.Router();

/**Admin in My Profile */

/**
 * no validation in below get API because data is fetched directly by AuthToken
 */
router.get("/myprofile/admin_profile/view", authmiddleware,
 admin_profile_view);
router.put(
  "/myprofile/admin_profile/resetpassword",
  authmiddleware,
  celebrate(admin_profile_reset_password_validation_schema),
  admin_profile_reset_password
);
router.put(
  "/myprofile/admin_profile/editadminbillinginfo",
  authmiddleware,
  // celebrate(admin_profile_admin_info_edit_validation),
  admin_profile_edit
);

//Above API is combined for below two
router.put(
  "/myprofile/admin_profile/editadmininfo",
  authmiddleware,
  celebrate(admin_profile_admin_info_edit_validation),
  admin_profile_admin_info_edit
);
router.put(
  "/myprofile/admin_profile/editbillingfinfo",
  authmiddleware,
  celebrate(admin_profile_mailing_billling_info_edit_validation),
  admin_profile_mailing_billling_info_edit
);

/**
 * combined above two API's into one
 */
router.put(
  "/myprofile/admin_profile/adminprofileedit",
  authmiddleware,
  celebrate(admin_profile_edit_validation_schema),
  admin_profile_edit
);

export default router;
