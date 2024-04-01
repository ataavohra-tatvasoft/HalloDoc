import express, { Router } from "express";
import { regions, professions, export_one, actions , physicians, roles} from "../../controllers";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

router.get("/commonroute/regions", authmiddleware, regions);
router.get("/commonroute/professions", authmiddleware, professions);
router.get("/commonroute/export", authmiddleware, export_one);
router.get("/commonroute/:confirmation_no/actions", authmiddleware, actions);
router.get("/commonroute/physicians", authmiddleware, physicians);
router.get("/commonroute/:account_type/roles", authmiddleware, roles);

export default router;
