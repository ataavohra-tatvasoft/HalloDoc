import express, { Router } from "express";
import {
  admin_profile_view,
  admin_profile_reset_password,
  admin_profile_admin_info_edit,
  admin_profile_mailing_billling_info_edit,
} from "../../controllers";
import {
  authmiddleware,
  admin_profile_info_edit_middleware,
} from "../../middlewares";
import multer, { diskStorage } from "multer";
// import path from "path";

const router: Router = express.Router();

/**Admin in My Profile */
router.get("/myprofile/admin_profile/view", authmiddleware, admin_profile_view);
router.put(
  "/myprofile/admin_profile/resetpassword",
  authmiddleware,
  admin_profile_reset_password
);
router.post(
  "/myprofile/admin_profile/editadmininfo",
  authmiddleware,
  admin_profile_info_edit_middleware,
  admin_profile_admin_info_edit
);
router.post(
  "/myprofile/admin_profile/editbillingfinfo",
  authmiddleware,
  admin_profile_mailing_billling_info_edit
);

export default router;
