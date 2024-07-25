/* eslint-disable no-undef */
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import message_constants from '../../constants/message_constants'
import { Controller, VerifiedToken, FormattedResponse } from '../../interfaces'
import { User, Documents, RequestModel } from '../../db/models'

export const medical_history: Controller = async (req: Request, res: Response) => {
  try {
    const { page, page_size } = req.query as {
      [key: string]: string
    }
    const page_number = Number(page) || 1
    const limit = Number(page_size) || 10
    const offset = (page_number - 1) * limit

    const { authorization } = req.headers as { authorization: string }

    const token: string = authorization.split(' ')[1]
    const verified_token = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as VerifiedToken
    const patient_id = verified_token.user_id

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }

    const { count, rows: requests } = await RequestModel.findAndCountAll({
      where: {
        patient_id: patient_id
      }
    })

    if (!requests) {
      return res.status(404).json({
        message: message_constants.RNF
      })
    }

    var i = offset + 1

    for (const request of requests) {
      const documents = await Documents.findAll({
        where: {
          request_id: request.request_id
        }
      })

      const formatted_request = {
        sr_no: i,
        request_id: request.request_id,
        confirmation_no: request.confirmation_no,
        created_date: request?.createdAt.toISOString().split('T')[0],
        request_state: request.request_state,
        request_status: request.request_status,
        documents: documents.map((document) => ({
          document_id: document.document_id,
          document_name: document.document_name,
          document_path: document.document_path
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
    return res.status(500).json({ error: message_constants.ISE })
  }
}

export const request_action_document: Controller = async (req: Request, res: Response) => {
  try {
    const { confirmation_no } = req.params

    const { authorization } = req.headers as { authorization: string }

    const token: string = authorization.split(' ')[1]
    const verified_token = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as VerifiedToken
    const patient_id = verified_token.user_id

    const request = await RequestModel.findOne({
      where: {
        confirmation_no,
        patient_id
      }
    })

    if (!request) {
      return res.status(404).json({
        message: message_constants.RNF
      })
    }

    const patient = await User.findOne({
      where: {
        user_id: patient_id
      }
    })

    if (!patient) {
      return res.status(404).json({
        message: message_constants.UNF
      })
    }

    const documents = await Documents.findAll({
      where: {
        request_id: request.request_id
      }
    })

    if (!documents) {
      return res.status(404).json({
        message: message_constants.DNF
      })
    }

    const formatted_response: FormattedResponse<any> = {
      status: true,
      data: []
    }

    const formatted_request = {
      patient_name: patient.firstname + ' ' + patient.lastname,
      confirmationNo: request.confirmation_no,
      documents: documents.map((document) => ({
        document_id: document?.document_id || null,
        uploader: document?.uploader || null,
        document_name: document?.document_name || null,
        docuement_path: document?.document_path || null
      }))
    }

    formatted_response.data.push(formatted_request)

    return res.status(200).json({
      ...formatted_response,
      message: message_constants.Success
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: message_constants.ISE })
  }
}
