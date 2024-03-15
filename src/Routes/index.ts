import express, { Router } from "express";
import login_routes from "./login_recover";
import signup_routes from "./signup";
import admin_dashboard from "./admin_routes/admin_dashboard";
import admin_myprofile from "./admin_routes/admin_myprofile";
import admin_access_roles from "./admin_routes/admin_access_roles";
import admin_provider_menu from "./admin_routes/admin_provider_menu";
import { authmiddleware } from "../middlewares";

const router: Router = express.Router();

router.use("/login", login_routes);
router.use("/signup", signup_routes);
router.use("/recoverpassword", login_routes);
router.use("/admin", admin_dashboard);
router.use("/admin", admin_myprofile);
router.use("/admin", admin_access_roles);
router.use("/admin", admin_provider_menu);

export default router;
