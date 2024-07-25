import express, { Router } from "express";
import {
  provider_shifts_list,
  provider_on_call,
  requested_shifts,
  approve_selected,
  delete_selected,
  create_shift,
  view_shift,
  edit_shift,
  edit_return_shift,
  delete_shift,
} from "../../../controllers";
import {
  provider_shifts_list_validation,
  provider_on_call_validation,
  requested_shifts_validation,
  approve_selected_validation,
  delete_selected_validation,
  create_shift_validation,
  view_shift_validation,
  edit_return_shift_validation,
  edit_shift_validation,
  delete_shift_validation,
} from "../../../validations";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../../middlewares";

const router: Router = express.Router();

/**                                           Admin in Scheduling menu                                                              */

router.get(
  "/scheduling_menu/provider_shifts_lists",
  authmiddleware,
  celebrate(provider_shifts_list_validation),
  provider_shifts_list
);
router.get(
  "/scheduling_menu/providers_on_call_list",
  authmiddleware,
  celebrate(provider_on_call_validation),
  provider_on_call
);
router.get(
  "/scheduling_menu/provider_shifts_lists/view_shift",
  authmiddleware,
  celebrate(view_shift_validation),
  view_shift
);
router.put(
  "/scheduling_menu/provider_shifts_lists/edit_shift",
  authmiddleware,
  celebrate(edit_shift_validation),
  edit_shift
);
router.delete(
  "/scheduling_menu/provider_shifts_lists/:shift_id/delete_shift",
  authmiddleware,
  celebrate(delete_shift_validation),
  delete_shift
);
router.put(
  "/scheduling_menu/provider_shifts_lists/:shift_id/edit_shift_return",
  authmiddleware,
  celebrate(edit_return_shift_validation),
  edit_return_shift
);
router.get(
  "/scheduling_menu/requested_shifts",
  authmiddleware,
  celebrate(requested_shifts_validation),
  requested_shifts
);
router.put(
  "/scheduling_menu/requested_shifts/approve_selected",
  authmiddleware,
  celebrate(approve_selected_validation),
  approve_selected
);
router.delete(
  "/scheduling_menu/requested_shifts/delete_selected",
  authmiddleware,
  celebrate(delete_selected_validation),
  delete_selected
);
router.post(
  "/scheduling_menu/create_shift",
  authmiddleware,
  celebrate(create_shift_validation),
  create_shift
);

export default router;
