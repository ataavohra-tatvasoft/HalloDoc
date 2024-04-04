import { Request, Response,NextFunction } from 'express'

export type Controller = (req: Request, res: Response , next:NextFunction ) => Promise<any>

export type FormattedResponse<T> = { status: boolean; data: T[] };

// export type FormattedRequest = { region_name: string };



