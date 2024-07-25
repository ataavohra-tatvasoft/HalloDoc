import express, { Router } from "express";
import {
  regions,
  professions,
  actions,
  physicians,
  roles,
  export_single,
  export_all,
  access,
  export_single_physician,
  export_all_physician,
  export_records,
  create_shift_region_physicians,
} from "../../controllers";
import { authmiddleware } from "../../middlewares";
import { celebrate } from "celebrate";
import {
  actions_validation,
  create_shift_region_physicians_validation,
  export_all_physician_validation,
  export_all_validation,
  export_records_validation,
  export_single_physician_validation,
  export_single_validation,
  roles_validation,
} from "../../validations/common_validations/common_validations";

const router: Router = express.Router();

router.get("/commonroute/regions", authmiddleware, regions);
router.get("/commonroute/professions", authmiddleware, professions);
router.get(
  "/commonroute/export_single",
  celebrate(export_single_validation),
  authmiddleware,
  export_single
);
router.get(
  "/commonroute/export_all",
  celebrate(export_all_validation),
  authmiddleware,
  export_all
);
router.get(
  "/commonroute/export_single_physician",
  celebrate(export_single_physician_validation),
  authmiddleware,
  export_single_physician
);
router.get(
  "/commonroute/export_all_physician",
  celebrate(export_all_physician_validation),
  authmiddleware,
  export_all_physician
);
router.get(
  "/commonroute/export_records",
  celebrate(export_records_validation),
  authmiddleware,
  export_records
);
router.get(
  "/commonroute/:confirmation_no/actions",
  celebrate(actions_validation),
  authmiddleware,
  actions
);
router.get("/commonroute/physicians", authmiddleware, physicians);

router.get(
  "/commonroute/create_shift/physicians",
  celebrate(create_shift_region_physicians_validation),
  authmiddleware,
  create_shift_region_physicians
);

router.get(
  "/commonroute/roles",
  celebrate(roles_validation),
  authmiddleware,
  roles
);
router.get("/commonroute/accesses", authmiddleware, access);

export default router;
