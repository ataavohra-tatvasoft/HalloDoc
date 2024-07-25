import express, { Router } from "express";
import {
  partner_vendor_list,
  add_business,
  update_business,
  delete_vendor,
  update_business_view,
} from "../../controllers";
import {
  partner_vendor_list_validation,
  add_business_validation,
  update_business_validation,
  delete_vendor_validation,
  update_business_view_validation,
} from "../../validations";
import { celebrate, Joi } from "celebrate";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

/**                                           Admin in partner menu                                                              */

router.get(
  "/partners/partners_vendorslist",
  authmiddleware,
  celebrate(partner_vendor_list_validation),
  partner_vendor_list
);
router.post(
  "/partners/add_business",
  authmiddleware,
  celebrate(add_business_validation),
  add_business
);
router.get(
  "/partners/:business_id/update_business_view",
  authmiddleware,
  celebrate(update_business_view_validation ),
  update_business_view
);
router.put(
  "/partners/:business_id/update_business",
  authmiddleware,
  celebrate(update_business_validation),
  update_business
);
router.delete(
  "/partners/:business_id/delete_vendor",
  authmiddleware,
  celebrate(delete_vendor_validation),
  delete_vendor
);

export default router;
