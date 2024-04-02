import express, { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
    requests_by_request_state_provider
} from "../../controllers";

import { authmiddleware } from "../../middlewares";
import {
    requests_by_request_state_provider_validation
} from "../../validations";
import { upload } from "../../utils";
const router: Router = express.Router();


/**                              Provider in Dashboard                                       */

router.get(
    "/dashboard/requests",
    authmiddleware,
    requests_by_request_state_provider
  );