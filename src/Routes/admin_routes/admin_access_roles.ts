import express, { Router } from "express";
import {
  access_accountaccess,
  access_accountaccess_edit,
  access_accountaccess_edit_save,
  access_accountaccess_delete,
  access_useraccess,
  access_useraccess_edit,
  access_useraccess_edit_save,
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import path from "path";

const router: Router = express.Router();

/**                             Admin in Access Roles                                     */
/** Admin Account Access */
router.get("/access/accountaccess", authmiddleware, access_accountaccess);
router.get(
  "/access/accountaccess/:user_id/edit",
  authmiddleware,
  access_accountaccess_edit
);
router.put(
  "/access/accountaccess/:user_id/edit/save",
  authmiddleware,
  access_accountaccess_edit_save
);
router.delete(
  "/access/accountaccess/:user_id/delete",
  authmiddleware,
  access_accountaccess_delete
);

/** Admin User Access */
router.get("/access/useraccess", authmiddleware, access_useraccess);
router.get(
  "/access/useraccess/:user_id/edit",
  authmiddleware,
  access_useraccess_edit
);
router.put(
  "/access/useraccess/:user_id/edit/save",
  authmiddleware,
  access_useraccess_edit_save
);

export default router;
