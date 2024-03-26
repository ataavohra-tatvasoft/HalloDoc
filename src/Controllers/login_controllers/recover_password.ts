import { Request, Response, NextFunction } from "express";
import Sequelize from "sequelize";
import User from "../../db/models/user";
import brcypt from "bcrypt";
import * as crypto from "crypto";
import dotenv from "dotenv";
import { Controller } from "../../interfaces/common_interface";
import message_constants from "../../public/message_constants";
import nodemailer from "nodemailer";

dotenv.config();
const Op = Sequelize.Op;

/**
 * @description Handles the process of initiating a password reset by sending a reset link to the user's email address.
 * @param {Request} req - The request object containing the user's email address.
 * @param {Response} res - The response object to send the status of the password reset initiation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the password reset initiation.
 */
export const forgot_password: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: message_constants.IEA,
        errormessage: message_constants.NF,
      });
    }

    const reset_token = crypto.createHash("sha256").update(email).digest("hex");
    const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour

    if (user) {
      await User.update(
        { reset_token: reset_token, reset_token_expiry: expireTime },
        { where: { email } }
      );
    }
    const mailContent = `
        <html>
        <p>You requested a password reset for your account.</p>
        </br>
        <p>Click the link below to reset your password:</p>
        </br>
        </br>
        <button> <a href = " http://localhost:3000/resetPassword/${reset_token}"> Reset Password </a></button>
        </br>
        </br>
        <p>This link will expire in 1 hour.</p>
        </form>
        </html>
      `;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      debug: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "vohraatta@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: mailContent,
    });
    if (!info) {
      return res.status(500).json({
        message: message_constants.ESRPL,
      });
    }

    return res.status(200).json({
      message: message_constants.RPLSE,
      response_message: message_constants.OK,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errormessage: message_constants.ISE,
    });
  }
};

/**
 * @description Handles the process of resetting the user's password using the provided reset token.
 * @param {Request} req - The request object containing the new password and reset token.
 * @param {Response} res - The response object to send the status of the password reset operation.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Response} A JSON response indicating the success or failure of the password reset operation.
 */
export const reset_password: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, reset_token } = req.body;
    const user = await User.findOne({
      where: {
        reset_token: reset_token,
        reset_token_expiry: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: message_constants.IERT,
        errormessage: message_constants.UA,
      });
    }

    const hashedPassword = await brcypt.hash(password, 10);
    if (user) {
      await User.update(
        {
          password: hashedPassword,
          reset_token: null,
          reset_token_expiry: null,
        },
        { where: { user_id: user.user_id } }
      );

      res.status(200).json({
        message: message_constants.PRS,
        errormessage: message_constants.OK,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: message_constants.ERP,
      errormessage: message_constants.ISE,
    });
  }
};
