import type { RequestHandler } from "express";
import { z } from "zod";
import type { UserType } from "../lib/definition";

type SafeParseReturnType<I, O> =
  | { success: true; data: O }
  | { success: false; error: z.ZodError<I> };

const validateUser: RequestHandler = (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const userSchema = z.object({
    firstname: z.string().min(2).max(45),
    lastname: z.string().min(2).max(45),
    email: z
      .string()
      .regex(
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
        "Email invalide",
      ),
    password: z
      .string()
      .regex(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm,
        "Le mot de passe doit contenir entre 8 et 16 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial",
      ),
  });

  const validData: SafeParseReturnType<unknown, UserType> =
    userSchema.safeParse({
      firstname,
      lastname,
      email,
      password,
    });

  if (!validData.success) {
    const errors: Record<string, string> = validData.error.issues.reduce<
      Record<string, string>
    >((acc, val) => {
      acc[val.path[0] as string] = val.message;
      return acc;
    }, {});

    res.status(401).json(errors);
    return;
  }

  next();
};

export default validateUser;
