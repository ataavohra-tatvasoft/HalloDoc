import express, { Router } from "express";
import {
regions, professions
} from "../../controllers";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

router.get("/commonroute/regions", authmiddleware, regions);
router.get("/commonroute/professions", authmiddleware, professions);

export default router;