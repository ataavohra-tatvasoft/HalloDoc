import express, { Router } from "express";
import {
  access_accountaccess,
  access_accountaccess_edit,
  manage_account_access,
  access_account_access_edit_save,
  access_account_access_delete,
  access_useraccess,
  access_useraccess_edit,
  manage_user_access,
  access_useraccess_edit_save,
} from "../../controllers";
import {
  manage_account_access_validation_schema,
  manage_user_access_validation_Schema,
} from "../../validations";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

/**                             Admin in Access Roles                                     */

/** Admin Account Access */

router.get("/access/accountaccess", authmiddleware, access_accountaccess);
router.get(
  "/access/accountaccess/:user_id/edit",
  authmiddleware,
  access_accountaccess_edit
);
/**
 * combined above two routes into one
 */
router.get(
  "/access/accountaccess/:user_id",
  authmiddleware,
  celebrate(manage_account_access_validation_schema),
  manage_account_access
);
router.put(
  "/access/accountaccess/:user_id/edit/save",
  authmiddleware,
  access_account_access_edit_save
);
router.delete(
  "/access/accountaccess/:user_id/delete",
  authmiddleware,
  access_account_access_delete
);

/** Admin User Access */

router.get("/access/useraccess", authmiddleware, access_useraccess);
router.get(
  "/access/useraccess/:user_id/edit",
  authmiddleware,
  access_useraccess_edit
);
/**
 * combined above two routes into one
 */
router.get(
  "/access/useraccess/:user_Id",
  authmiddleware,
  celebrate(manage_user_access_validation_Schema),
  manage_user_access
);
router.put(
  "/access/useraccess/:user_id/edit/save",
  authmiddleware,
  access_useraccess_edit_save
);

export default router;
