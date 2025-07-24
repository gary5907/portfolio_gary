import type { RequestHandler } from "express";

export const deleteCookie: RequestHandler = async (req, res, next) => {
  try {
    const validCookie = req.cookies.auth_token;

    if (!validCookie) {
      res.status(401).json({ message: "cookie is not valid" });
      return;
    }

    res
      .clearCookie("auth_token", {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
      })
      .json({ message: "cookie deleted" });

    next();
  } catch (err) {
    res.status(401).json({ message: err });
  }
};
