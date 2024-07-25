import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import { forgot_password, reset_password, login } from '../controllers'
import {
  forgot_password_validation_schema,
  reset_password_validation_schema
} from '../validations/index'
const router: Router = express.Router()

router.post('/user_login', login)

router.post('/user_forgotpassword', celebrate(forgot_password_validation_schema), forgot_password)

router.post('/user_resetpassword', celebrate(reset_password_validation_schema), reset_password)

export default router
