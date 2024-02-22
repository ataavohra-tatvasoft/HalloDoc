import express, { Router } from "express";
import loginRoutes from "./login";
import signupRoutes from "./signup";
import {adminSchemaSignUp} from "../Middlewares/adminschema";

const router: Router = express.Router();

router.use("/login", loginRoutes);
router.use("/signup",adminSchemaSignUp, signupRoutes);

export default router;