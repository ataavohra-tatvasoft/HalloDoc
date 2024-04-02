import express, { Router } from "express";
import { regions, professions, actions , physicians, roles, export_single, export_all} from "../../controllers";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

router.get("/commonroute/regions", authmiddleware, regions);
router.get("/commonroute/professions", authmiddleware, professions);
router.get("/commonroute/export_single", authmiddleware, export_single);
router.get("/commonroute/export_all", authmiddleware, export_all);
router.get("/commonroute/:confirmation_no/actions", authmiddleware, actions);
router.get("/commonroute/physicians", authmiddleware, physicians);
router.get("/commonroute/:account_type/roles", authmiddleware, roles);

export default router;
