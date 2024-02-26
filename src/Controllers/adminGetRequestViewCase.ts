import { NextFunction, Request, Response } from 'express';
import RequestModel from '../Models/request';
export const getViewCaseForRequest = async (req: Request, res: Response, next :NextFunction) => {
    const { requestId } = req.params;
  
    try {
      const request = await RequestModel.findByPk(requestId);
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json({ request });
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}