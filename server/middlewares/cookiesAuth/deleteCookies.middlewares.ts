import type { RequestHandler } from "express";

export const deleteCookie: RequestHandler = async (req, res) => {
  try {
    const validCookie = req.cookies.auth_token;

    if (!validCookie) {
      res.status(401).json({ message: "Cookie is not valid or missing" });
      return;
    }

    res
      .clearCookie("auth_token", {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
      })
      .json({ message: "Cookie deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
