import { Request, Response, NextFunction } from "express";
import Sequelize from "sequelize";
import Admin from "../Models/admin";
import nodemailer from "nodemailer";
import brcypt from "bcrypt";
import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const Op = Sequelize.Op;
// import SparkPostTransport from 'nodemailer-sparkpost-transport';
// import uuid from 'uuid';

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await Admin.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // const resetToken = uuid();
    const resetToken = crypto.createHash("sha256").update(email).digest("hex");
    const expireTime = Date.now() + 60*60*1000; // 1 hour
    // console.log(resetToken, expireTime, user.firstname);

    // Update user with reset token and expiry
    await Admin.update(
      { reset_token: resetToken, reset_token_expiry: expireTime },
      { where: { email } }
    );

    // Create email content
    const resetUrl = `http://localhost:7000/forgotresetpassword/resetpassword`;
    const mailContent = `
      <html>
      <form action = "${resetUrl}" method="POST"> 
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <p>Your token is: ${resetToken}</p>
      <label for="ResetToken">Token:</label>
      <input type="text" id="ResetToken" name="ResetToken" required>
      <br>
      <label for="Password">Password:</label>
      <input type="password" id="Password" name="Password" required>
      <br>
      <button type = "submit">Reset Password</button>
      <p>This link will expire in 1 hour.</p>
      </form>
      </html>
    `;
    // const transportOptions: SparkPostTransport.Options = {
    //   apiKey: process.env.SPARKPOST_API_KEY,
    // };

    // const transporter = nodemailer.createTransport(SparkPostTransport(transportOptions));
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Adjust based on your SMTP server
      debug: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("Test", {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // Adjust based on your SMTP server
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

    console.log("Email sent: %s", info.messageId);

    res.status(200).json({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset password link" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ResetToken, Password } = req.body;
    console.log(ResetToken, Password);
    // Validate reset token and expiry
    const user = await Admin.findOne({
      where: {
        reset_token: ResetToken,
        reset_token_expiry: {[Op.gt]: Date.now() }, // Ensure token is not expired
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token", });
    }

    // Hash the new password securely (consider using bcryptjs v5 for updated algorithms)
    const hashedPassword = await brcypt.hash(Password, 10); // Adjust cost factor as needed

    // Update user password and clear reset token
    await Admin.update(
      { password: hashedPassword, reset_token: null, reset_token_expiry: null },
      { where: { adminid: user.adminid } }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
