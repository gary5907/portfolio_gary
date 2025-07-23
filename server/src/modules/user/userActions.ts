import type { RequestHandler } from "express";
import userRepository from "./userRepository";

const browse: RequestHandler = async (req, res) => {
  const users = await userRepository.readAll();

  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);

  res.json(usersWithoutPasswords);
};

const read: RequestHandler = async (req, res) => {
  const parsedId = Number.parseInt(req.params.id);

  const user = await userRepository.read(parsedId);

  if (user != null) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.sendStatus(404);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };

    const insertId: number = await userRepository.create(newUser);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
