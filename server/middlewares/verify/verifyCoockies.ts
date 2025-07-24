import jwt from "jsonwebtoken";

import type { RequestHandler } from "express";
import type { JwtPayload } from "jsonwebtoken";

export const verifyCookie: RequestHandler = async (req, res, next) => {
  try {
    const validCookie = req.cookies.auth_token;

    if (!validCookie) {
      res.status(401).json({ message: "cookie is not valid" });
      return;
    }

    req.auth = jwt.verify(
      validCookie,
      process.env.APP_SECRET as string,
    ) as JwtPayload;

    res.json(req.auth);
  } catch (err) {
    res.status(401).json({ message: err });
  }
  next();
};
