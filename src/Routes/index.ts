import express, { Router } from "express";
import loginRoutes from "./login";
import signupRoutes from "./signup";
import recoverPasswordRoutes from "./recoverPassword";
import {adminSchemaSignUp} from "../Middlewares";
import adminRoutes from "./admin";
import {adminauthmiddleware} from "../Middlewares";

const router: Router = express.Router();

router.use("/login", loginRoutes);
router.use("/signup",adminSchemaSignUp, signupRoutes);
router.use("/recoverpassword",recoverPasswordRoutes);
router.use('/admin',adminauthmiddleware, adminRoutes);

export default router;