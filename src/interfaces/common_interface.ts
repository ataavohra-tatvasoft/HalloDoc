import { Request, Response,NextFunction } from 'express'

type Controller = (req: Request, res: Response , next:NextFunction ) => Promise<any>

export { Controller };
