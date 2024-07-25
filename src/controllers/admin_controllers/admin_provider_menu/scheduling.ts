import { Request, Response } from 'express'
import { DATE, Op } from 'sequelize'
import { Controller, FormattedResponse, FormattedResponse_2 } from '../../../interfaces'
import message_constants from '../../../constants/message_constants'
import { manage_shift_in_time, repeat_days_shift, shift_timeouts } from '../../../utils'
import { User, Shifts } from '../../../db/models'

/**                             Admin in Scheduling Menu                                    */

export const provider_shifts_list: Controller = async (req: Request, res: Response) => {
  try {
    const { region, page, page_size } = req.query
    const page_number = Number(page) || 1
    const limit = Number(page_size) || 10
    const offset = (page_number - 1) * limit

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: [
        'user_id',
        'firstname',
        'lastname',
        'type_of_user',
        'role_id',
        'status'
        // "on_call_status",
      ],
      where: {
        type_of_user: 'physician'
        // on_call_status: "scheduled",
      },
      include: [
        {
          model: Shifts,
          as: 'Shifts',
          attributes: [
            'shift_id',
            'user_id',
            'region',
            'status',
            'shift_date',
            'start',
            'end',
            'repeat_end',
            'repeat_days'
          ],
          where: {
            ...(region && { region: region })
          }
        }
      ]
    })
    var i = offset + 1
    for (const provider of providers) {
      const formatted_request = {
        sr_no: i,
        user_id: provider.user_id,
        provider_name: provider.firstname + ' ' + provider.lastname,
        type_of_user: provider.type_of_user,
        status: provider.status,
        shifts: provider.Shifts?.map((shift) => ({
          shift_id: shift.shift_id,
          user_id: shift.user_id,
          region: shift.region,
          status: shift.status,
          shift_date: shift.shift_date.toISOString().split('T')[0],
          shift_month: shift.shift_date.getMonth() + 1,
          start: shift.start,
          end: shift.end,
          repeat_days: shift.repeat_days,
          repeat_end: shift.repeat_end
        }))
      }
      i++
      formatted_response.data.push(formatted_request)
    }

    return res.status(200).json({
      ...formatted_response,
      total_pages: Math.ceil(count / limit),
      current_page: page_number,
      total_count: count
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const provider_on_call: Controller = async (req: Request, res: Response) => {
  try {
    const { page, page_size } = req.query
    const page_number = Number(page) || 1
    const limit = Number(page_size) || 10
    const offset = (page_number - 1) * limit

    const formatted_response: FormattedResponse_2<any> = {
      status: true,
      provider_on_call: [],
      provider_off_duty: []
    }
    const { count, rows: providers_on_call } = await User.findAndCountAll({
      attributes: [
        'user_id',
        'firstname',
        'lastname',
        'type_of_user',
        'role_id',
        'status',
        'on_call_status'
      ],
      where: {
        type_of_user: 'physician'
      }
    })
    var i = offset + 1
    for (const provider of providers_on_call) {
      if (provider.on_call_status == 'scheduled') {
        const formatted_request_1 = {
          sr_no: i,
          user_id: provider.user_id,
          provider_name: provider.firstname + ' ' + provider.lastname,
          type_of_user: provider.type_of_user,
          status: provider.status,
          on_call_status: provider.on_call_status
        }
        formatted_response.provider_on_call.push(formatted_request_1)
      } else {
        const formatted_request_2 = {
          sr_no: i,
          user_id: provider.user_id,
          provider_name: provider.firstname + ' ' + provider.lastname,
          type_of_user: provider.type_of_user,
          status: provider.status,
          on_call_status: provider.on_call_status + ' i.e NO'
        }
        formatted_response.provider_off_duty.push(formatted_request_2)
      }
      i++
    }

    return res.status(200).json({
      ...formatted_response,
      total_pages: Math.ceil(count / limit),
      current_page: page_number,
      total_count: count
    })
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const requested_shifts: Controller = async (req: Request, res: Response) => {
  try {
    const { region, view_current_month_shift, page, page_size } = req.query
    function get_current_month(): [number, number] {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      return [year, month + 1] // Return year and month (1-indexed)
    }

    const [currentYear, currentMonth] = get_current_month()
    const page_number = Number(page) || 1
    const limit = Number(page_size) || 10
    const offset = (page_number - 1) * limit

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }
    const { count, rows: providers } = await User.findAndCountAll({
      attributes: [
        'user_id',
        'firstname',
        'lastname',
        'type_of_user',
        'role_id'
        // "on_call_status",
      ],
      where: {
        type_of_user: 'physician'
        // on_call_status: "scheduled",
      },
      include: [
        {
          model: Shifts,
          as: 'Shifts',
          attributes: [
            'shift_id',
            'user_id',
            'region',
            'status',
            'shift_date',
            'start',
            'end',
            'repeat_end',
            'repeat_days'
          ],
          where: {
            ...(region && { region: region }),
            status: 'pending',
            ...(view_current_month_shift && {
              [Op.and]: [
                {
                  shift_date: {
                    [Op.gte]: new Date(`${currentYear}-${currentMonth}-01`)
                      .toISOString()
                      .split('T')[0] // Start of current month
                  }
                },
                {
                  shift_date: {
                    [Op.lte]: new Date(
                      `${currentYear}-${currentMonth}-${new Date(
                        currentYear,
                        currentMonth,
                        0
                      ).getDate()}`
                    )
                      .toISOString()
                      .split('T')[0] // End of current month (considering leap years)
                  }
                }
              ]
            })
          }
        }
      ]
    })
    var i = offset + 1
    for (const provider of providers) {
      const formatted_request_1 = {
        sr_no: i,
        shifts: provider.Shifts?.map((shift) => ({
          shift_id: shift.shift_id,
          user_id: shift.user_id,
          staff: provider.firstname + ' ' + provider.lastname,
          region: shift.region,
          status: shift.status,
          shift_date: shift.shift_date.toISOString().split('T')[0],
          time: shift.start + ' - ' + shift.end
        }))
      }
      formatted_response.data.push(formatted_request_1)
      i++
    }

    return res.status(200).json({
      ...formatted_response,
      total_pages: Math.ceil(count / limit),
      current_page: page_number,
      total_count: count
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const approve_selected: Controller = async (req: Request, res: Response) => {
  try {
    const { shift_ids } = req.body as {
      shift_ids: Array<number>
    }

    for (const shift_id of shift_ids) {
      // shift_id = Number(shift_id);

      const is_shift = await Shifts.findOne({
        where: {
          shift_id
        }
      })

      if (!is_shift) {
        return res.status(404).json({
          message: message_constants.ShNF
        })
      }

      const shifts = Shifts.update(
        {
          status: 'approved'
        },
        {
          where: {
            shift_id
          }
        }
      )

      if (!shifts) {
        return res.status(500).json({
          message: message_constants.EWU
        })
      }

      await manage_shift_in_time(is_shift, 'Asia/Kolkata')
    }

    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const delete_selected: Controller = async (req: Request, res: Response) => {
  try {
    const { shift_ids } = req.body as {
      shift_ids: Array<number>
    }

    for (const shift_id of shift_ids) {
      // shift_id = Number(shift_id);
      const shifts = Shifts.destroy({
        where: {
          shift_id
        }
      })
      if (!shifts) {
        return res.status(500).json({
          message: message_constants.EWD
        })
      }
    }
    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const create_shift: Controller = async (req: Request, res: Response) => {
  try {
    const { region, physician, shift_date, start, end, repeat_days, repeat_end } = req.body
    const firstname = physician.split(' ')[0]
    const lastname = physician.split(' ')[1]
    const date = new DATE(shift_date)
    console.log(date)
    const user = await User.findOne({
      where: {
        firstname,
        lastname
      }
    })
    if (!user) {
      return res.status(500).json({
        message: message_constants.PhNF
      })
    }

    const shifts = repeat_days_shift(
      user.user_id,
      region,
      physician,
      shift_date,
      start,
      end,
      repeat_days,
      repeat_end,
      res
    )

    if (!shifts) {
      return res.status(500).json({
        message: 'Error while creating shifts!'
      })
    }
    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const view_shift: Controller = async (req: Request, res: Response) => {
  try {
    const { shift_id } = req.query
    const numeric_shift_id = Number(shift_id)

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }
    const shift = await Shifts.findOne({
      where: {
        shift_id: numeric_shift_id
      },
      attributes: ['shift_id', 'region', 'physician', 'shift_date', 'start', 'end']
    })

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF
      })
    }
    const formatted_request = {
      shift_id: shift.shift_id,
      region: shift.region,
      physician: shift.physician,
      shift_date: shift.shift_date.toISOString().split('T')[0],
      start: shift.start,
      end: shift.end
    }
    formatted_response.data.push(formatted_request)

    return res.status(200).json({
      ...formatted_response
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const edit_shift: Controller = async (req: Request, res: Response) => {
  try {
    const { shift_id, region, physician, shift_date, start, end } = req.body
    const numeric_shift_id = Number(shift_id)

    const shift = await Shifts.findOne({
      where: {
        shift_id: numeric_shift_id
      },
      attributes: ['region', 'physician', 'shift_date', 'start', 'end']
    })

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF
      })
    }

    const user = await User.findOne({
      where: {
        firstname: physician.split(' ')[0],
        lastname: physician.split(' ')[1]
      }
    })
    if (!user) {
      return res.status(500).json({
        message: message_constants.PhNF
      })
    }

    const update_shift = await Shifts.update(
      {
        user_id: user.user_id,
        region,
        physician,
        shift_date,
        start,
        end
      },
      {
        where: {
          shift_id
        }
      }
    )

    if (!update_shift) {
      return res.status(500).json({
        message: message_constants.EWU
      })
    }

    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const delete_shift: Controller = async (req: Request, res: Response) => {
  try {
    let { shift_id } = req.params
    const shifts = Shifts.destroy({
      where: {
        shift_id
      }
    })
    if (!shifts) {
      return res.status(500).json({
        message: message_constants.EWD
      })
    }

    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    return res.status(500).json({ message: message_constants.ISE })
  }
}

export const edit_return_shift: Controller = async (req: Request, res: Response) => {
  try {
    const { shift_id } = req.params

    const shift = await Shifts.findOne({
      where: {
        shift_id: Number(shift_id)
      }
    })

    if (!shift) {
      return res.status(500).json({
        message: message_constants.NF
      })
    }

    if (shift.status == 'pending') {
      const update_shift = await Shifts.update(
        {
          status: 'approved'
        },
        {
          where: {
            shift_id
          }
        }
      )

      if (!update_shift) {
        return res.status(500).json({
          message: message_constants.EWU
        })
      }
      await manage_shift_in_time(shift, 'Asia/Kolkata')
    } else {
      const update_shift = await Shifts.update(
        {
          status: 'pending'
        },
        {
          where: {
            shift_id
          }
        }
      )

      if (!update_shift) {
        return res.status(500).json({
          message: message_constants.EWU
        })
      }

      await User.update({ on_call_status: 'un-scheduled' }, { where: { user_id: shift.user_id } })

      console.log(shift_timeouts)
      const timeout_ids = shift_timeouts.get(shift.shift_id) || []

      // Clear each stored timeout ID
      for (const id of timeout_ids) {
        console.log(id)
        // eslint-disable-next-line no-undef
        clearTimeout(id)
      }

      // Remove timeout IDs from storage (optional)
      shift_timeouts.delete(shift.shift_id)
    }

    return res.status(200).json({
      message: message_constants.Success
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: message_constants.ISE })
  }
}
