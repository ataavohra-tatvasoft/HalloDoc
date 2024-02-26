import express, { Router } from "express";
import loginRoutes from "./login";
import signupRoutes from "./signup";
import forgotResetPasswordRoutes from "./forgotResetPassword";
import {adminSchemaSignUp} from "../Middlewares/adminschema";
import adminRoutes from "./admin";
import {adminauthmiddleware} from "../Middlewares/adminauth";

const router: Router = express.Router();

router.use("/login", loginRoutes);
router.use("/signup",adminSchemaSignUp, signupRoutes);
router.use("/forgotresetpassword",forgotResetPasswordRoutes);
router.get('/admin',adminauthmiddleware, adminRoutes);

export default router;