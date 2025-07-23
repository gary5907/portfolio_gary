import type { RequestHandler } from "express";
import userRepository from "../src/modules/user/userRepository";

export const checkEmail: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userRepository.readByEmail(email);

    if (user) {
      res.status(403).json({
        message: "Cette adresse email est déjà utilisée",
      });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const checkEmailAndStoreUserData: RequestHandler = async (
  req,
  res,
  next,
) => {
  const { email } = req.body;

  try {
    const user = await userRepository.readByEmail(email);

    if (!user) {
      res.status(403).json({
        message: "La combinaison email et mot de passe et incorrect",
      });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};
