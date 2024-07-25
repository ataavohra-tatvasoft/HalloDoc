import express, { Router } from "express";
import {
  provider_create_shift,
  provider_edit_shift,
  provider_provider_shifts_list,
  provider_view_shift,
} from "../../controllers";
import {
  provider_create_shift_validation,
  provider_edit_shift_validation,
  provider_provider_shifts_list_validation,
  provider_view_shift_validation,
} from "../../validations";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

/**                                           Provider/Physician in Scheduling menu                                                              */

router.get(
  "/scheduling_menu/provider_shifts_lists",
  authmiddleware,
  celebrate(provider_provider_shifts_list_validation),
  provider_provider_shifts_list
);
router.post(
  "/scheduling_menu/provider_create_shift",
  authmiddleware,
  celebrate(provider_create_shift_validation),
  provider_create_shift
);
router.get(
  "/scheduling_menu/provider_shifts_lists/view_shift",
  authmiddleware,
  celebrate(provider_view_shift_validation),
  provider_view_shift
);
router.put(
  "/scheduling_menu/provider_shifts_lists/edit_shift",
  authmiddleware,
  celebrate(provider_edit_shift_validation),
  provider_edit_shift
);

export default router;
