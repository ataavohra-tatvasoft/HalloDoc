import express, { Router } from "express";
import login_routes from "./login";
import signup_routes from "./signup";
import recover_password_routes from "./recover_password";
import {admin_schema_signup} from "../middlewares";
import admin_routes from "./admin";
import {admin_authmiddleware} from "../middlewares";

const router: Router = express.Router();

router.use("/login", login_routes);
router.use("/signup",admin_schema_signup, signup_routes);
router.use("/recoverpassword",recover_password_routes);
router.use('/admin',admin_authmiddleware, admin_routes);

export default router;