import express, { Router } from "express";
import {
  access_accountaccess,
  access_accountaccess_edit,
  access_accountaccess_edit_save,
  access_account_access_create_access,
  access_account_access_delete,
  access_useraccess,
  access_useraccess_edit,
  access_useraccess_edit_save,
} from "../../controllers";
import {
  access_accountaccess_validation,
  access_accountaccess_edit_validation,
  access_account_access_create_access_validation,
  access_account_access_delete_validation,
  access_useraccess_validation,
  access_useraccess_edit_validation,
  access_useraccess_edit_save_validation,
  access_accountaccess_edit_save_validation
} from "../../validations";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

/**                             Admin in Access Roles                                     */

/** Admin Account Access */

router.get(
  "/access/accountaccess",
  authmiddleware,
  celebrate(access_accountaccess_validation),
  access_accountaccess
);
router.get(
  "/access/accountaccess/:role_id/edit",
  authmiddleware,
  celebrate(access_accountaccess_edit_validation),
  access_accountaccess_edit
);
router.put(
  "/access/accountaccess/:role_id/save_edit",
  authmiddleware,
  celebrate(access_accountaccess_edit_save_validation),
  access_accountaccess_edit_save
);

/**
 * combined above two routes into one
 */

router.delete(
  "/access/accountaccess/:role_id/delete",
  authmiddleware,
  celebrate(access_account_access_delete_validation),
  access_account_access_delete
);

router.post(
  "/access/accountaccess/create_access",
  authmiddleware,
  celebrate(access_account_access_create_access_validation),
  access_account_access_create_access
);



/** Admin User Access */

router.get(
  "/access/useraccess",
  authmiddleware,
  celebrate(access_useraccess_validation),
  access_useraccess
);
router.get(
  "/access/useraccess/:user_id/edit",
  authmiddleware,
  celebrate(access_useraccess_edit_validation),
  access_useraccess_edit
);

/**
 * combined above two routes into one
 */

router.put(
  "/access/useraccess/:user_id/edit/save",
  authmiddleware,
  celebrate(access_useraccess_edit_save_validation),
  access_useraccess_edit_save
);

export default router;
