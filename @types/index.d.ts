export {};

declare global {
  namespace Express {
    export interface Request {
      query: {
        [key: string]: string;
      };
      // user: {};
    }
  }
}
