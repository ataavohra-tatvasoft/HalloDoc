import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import { provider_accept_request, requests_by_request_state_provider } from "../../controllers";

import { authmiddleware } from "../../middlewares";
import { provider_accept_request_validation, requests_by_request_state_provider_validation } from "../../validations";
import { upload } from "../../utils";
const router: Router = express.Router();

/**                              Provider in Dashboard                                       */

router.get(
  "/dashboard/requests",
  authmiddleware,
  celebrate(requests_by_request_state_provider_validation),
  requests_by_request_state_provider
);

router.put(
  "/dashboard/requests/:confirmation_no/actions/accept_request",
  authmiddleware,
  celebrate(provider_accept_request_validation),
  provider_accept_request
);

export default router;
