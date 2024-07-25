import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import {
  create_patient_account,
  patient_profile_edit,
  patient_profile_view
} from '../../controllers'
import {
  create_patient_account_validation,
  patient_profile_edit_validation
} from '../../validations/index'
const router: Router = express.Router()

router.get('/my_profile/user_profile_view', patient_profile_view)

router.put(
  '/my_profile/user_profile_edit',
  celebrate(patient_profile_edit_validation),
  patient_profile_edit
)

router.post(
  '/create_account/patient_account',
  celebrate(create_patient_account_validation),
  create_patient_account
)

export default router
