// to make the file a module and avoid the TypeScript error
export type { auth };

declare global {
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // Add your custom properties here, for example:
      //
      // user?: { ... }
      /* ************************************************************************* */
      user?: {
        id: number;
      };
      auth?: JwtPayload;
    }
  }
}
