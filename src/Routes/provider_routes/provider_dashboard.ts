import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  provider_accept_request,
  requests_by_request_state_provider,
  transfer_request_provider,
} from "../../controllers";

import { authmiddleware } from "../../middlewares";
import {
  provider_accept_request_validation,
  requests_by_request_state_provider_validation,
  transfer_request_provider_validation,
} from "../../validations";
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

router.post(
  "/dashboard/requests/:confirmation_no/actions/transfer_request",
  authmiddleware,
  celebrate(transfer_request_provider_validation),
  transfer_request_provider
);

export default router;
