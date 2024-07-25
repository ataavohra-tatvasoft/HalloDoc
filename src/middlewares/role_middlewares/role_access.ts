/* eslint-disable no-undef */
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import message_constants from '../../constants/message_constants'
import { VerifiedToken } from '../../interfaces'
import { Role, Access } from '../../db/models'

export const role_access_middleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers as { authorization: string }

  try {
    if (!authorization) {
      return res.status(401).json({ error: 'Not authorized' })
    }

    const token: string = authorization.split(' ')[1]
    const verified_token = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as VerifiedToken

    const role = await Role.findOne({
      where: {
        role_id: verified_token.role_id
      },
      include: [
        {
          model: Access
        }
      ]
    })
    if (!role) {
      return res.status(404).json({
        message: message_constants.RoNF
      })
    }
    for (const access of role.Access) {
      if (access.access_name == 'dashboard') {
        next()
      } else {
        return res.status(500).json({
          message: message_constants.AD
        })
      }
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token', errormessage: message_constants.UA })
    } else {
      console.log(err)
      return res.status(500).json({ message: 'Server error', errormessage: message_constants.ISE })
    }
  }
}

export default role_access_middleware
