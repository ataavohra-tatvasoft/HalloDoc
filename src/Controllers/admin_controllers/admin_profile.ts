import { NextFunction, Request, Response } from "express";
import Admin from "../../models/request";



export const admin_profile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { admin_ID } = req.params;
  
    try {
      const profile = await Admin.findByPk(admin_ID);
      if (!profile) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json({ profile });
    } catch (error) {
      console.error("Error fetching Admin Profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  