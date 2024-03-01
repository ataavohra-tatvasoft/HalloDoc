import express, { Router } from "express";
import login_routes from "./login_recover";
import signup_routes from "./signup";
import recover_password_routes from "./login_recover";
import {admin_schema_signup} from "../middlewares";
import admin_routes from "./admin";
import {authmiddleware} from "../middlewares";

const router: Router = express.Router();

router.use("/login", login_routes);
router.use("/signup",admin_schema_signup, signup_routes);
router.use("/recoverpassword",recover_password_routes);
router.use('/admin',authmiddleware, admin_routes);

export default router;