import express, { Router } from "express";
import login_routes from "./login_recover";
import signup_routes from "./signup";

import admin_dashboard from "./admin_routes/admin_dashboard";
import admin_myprofile from "./admin_routes/admin_myprofile";
import admin_access_roles from "./admin_routes/admin_access_roles";
import admin_provider_menu from "./admin_routes/admin_provider_menu/provider";
import admin_provider_menu_2 from "./admin_routes/admin_provider_menu/scheduling";
import admin_partner_vendor_menu from "./admin_routes/admin_partner_vendor_menu";
import admin_records_menu from "./admin_routes/admin_records_menu";

import provider_dashboard from "./provider_routes/provider_dashboard";

import common_routes from "./common_routes/common_routes";
import common_request_actions from "./common_routes/common_request_actions";



const router: Router = express.Router();

router.use("/login", login_routes);
router.use("/signup", signup_routes);
router.use("/recoverpassword", login_routes);

/** Admin Routes */
router.use("/admin", admin_dashboard);
router.use("/admin", admin_myprofile);
router.use("/admin", admin_access_roles);
router.use("/admin", admin_provider_menu);
router.use("/admin", admin_provider_menu_2);
router.use("/admin", admin_partner_vendor_menu);
router.use("/admin", admin_records_menu);
router.use("/admin", admin_dashboard);

/** Provider Routes */
router.use("/provider", provider_dashboard);

/**Common Routes */
router.use("/common", common_routes);
router.use("/common",common_request_actions);

export default router;
