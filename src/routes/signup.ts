import express, { Router } from 'express'
import { admin_signup } from '../controllers'
import { admin_schema_signup } from '../middlewares'

const router: Router = express.Router()

router.post('/adminsignup', admin_schema_signup, admin_signup)

export default router
