/* eslint-disable no-undef */
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Controller, FormattedResponse, VerifiedToken } from '../../interfaces'
import message_constants from '../../constants/message_constants'
import { update_region_mapping } from '../../utils'
import { User, Region, Role } from '../../db/models'

/** Configs */
dotenv.config({ path: `.env` })

/**Admin in My Profile */

/**
 * @description Retrieves and formats the profile data of an admin user.
 */
export const admin_profile_view: Controller = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers as { authorization: string }
    const token: string = authorization.split(' ')[1]
    const verified_token = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as VerifiedToken
    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }
    const admin_id = verified_token.user_id
    const profile = await User.findOne({
      where: {
        user_id: admin_id
      },
      attributes: [
        'user_id',
        'username',
        'role_id',
        'status',
        'firstname',
        'lastname',
        'email',
        'mobile_no',
        'address_1',
        'address_2',
        'city',
        'state',
        'zip',
        'billing_mobile_no'
      ],
      include: [
        {
          model: Region,
          attributes: ['region_id', 'region_name']
        },
        {
          model: Role,
          attributes: ['role_name']
        }
      ]
    })
    if (!profile) {
      return res.status(404).json({ error: message_constants.PNF })
    }

    const is_role = await Role.findOne({
      where: {
        role_id: profile.role_id
      }
    })
    if (!is_role) {
      return res.status(500).json({
        message: message_constants.RoNF
      })
    }
    const formattedRequest = {
      admin_user_id: profile.user_id,
      admin_account_information: {
        username: profile.username,
        status: profile.status,
        role: is_role.role_name
      },
      admin_administrator_information: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        mobile_no: profile.mobile_no,
        regions: profile.Regions?.map((region) => ({
          region_id: region.region_id,
          region_name: region.region_name
        }))
      },
      admin_mailing_billing_information: {
        address_1: profile.address_1,
        address_2: profile.address_2,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        billing_mobile_no: profile.billing_mobile_no
      }
    }
    formatted_response.data.push(formattedRequest)

    return res.status(200).json({
      ...formatted_response
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: message_constants.ISE })
  }
}

/**
 * @description Resets the password of an admin user.
 */
export const admin_profile_reset_password: Controller = async (req: Request, res: Response) => {
  try {
    const {
      body: { password, user_id }
    } = req

    const hashedPassword: string = await bcrypt.hash(password, 10)
    const user_data = await User.findOne({
      where: {
        user_id
      }
    })

    if (!user_data) {
      return res.status(200).json({ status: message_constants.UNF })
    }
    if (user_data) {
      const updatePassword = await User.update(
        { password: hashedPassword, status: 'active' },
        {
          where: {
            user_id
          }
        }
      )

      if (!updatePassword) {
        return res.status(200).json({ status: message_constants.EWU })
      }
      if (updatePassword) {
        return res.status(200).json({ status: message_constants.Success })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: message_constants.ISE })
  }
}

/**
 * @description Handles the editing of admin profile information including personal and billing details.
 */

export const admin_profile_edit: Controller = async (req: Request, res: Response) => {
  try {
    const {
      user_id,
      firstname,
      lastname,
      email,
      mobile_no,
      address_1,
      address_2,
      city,
      state,
      zip,
      billing_mobile_no
    } = req.body

    const { region_ids } = req.body as {
      region_ids: Array<number>
    }

    const admin_profile = await User.findOne({
      where: {
        user_id
      }
    })

    if (!admin_profile) {
      return res.status(404).json({ error: message_constants.ANF })
    }

    const update_profile_status = await User.update(
      {
        firstname,
        lastname,
        email,
        mobile_no,
        address_1,
        address_2,
        city,
        state,
        zip,
        billing_mobile_no
      },
      {
        where: {
          user_id
        }
      }
    )

    if (!update_profile_status) {
      return res.status(500).json({ status: message_constants.EWU })
    }

    if (region_ids) {
      await update_region_mapping(user_id, region_ids, req, res)
    }

    return res.status(200).json({ status: message_constants.US })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: message_constants.ISE })
  }
}
