/* eslint-disable no-unused-vars */
export {}

declare global {
  namespace Express {
    export interface Request {
      query: {
        [key: string]: string
      }
    }
  }
}
