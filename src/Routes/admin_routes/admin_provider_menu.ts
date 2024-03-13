import express, { Router } from "express";
import { provider_list } from "../../controllers";
import { authmiddleware } from "../../middlewares";
import multer, { diskStorage } from "multer";
import path from "path";

const router: Router = express.Router();

/**                             Admin in Provider Menu                                    */
router.get("/providermenu/provider_list", authmiddleware, provider_list);
export default router;
