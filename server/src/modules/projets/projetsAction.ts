import type { NextFunction, Request, Response } from "express";
import projetsRepository from "./projetsRepository";

const browseWithSkills = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projets = await projetsRepository.readAllWithSkills();
    res.json(projets);
  } catch (err) {
    next(err);
  }
};

const browse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projets = await projetsRepository.readAll();
    res.json(projets);
  } catch (err) {
    next(err);
  }
};

const read = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const projet = await projetsRepository.read(id);
    if (!projet) {
      res.status(404).json({ error: "Projet non trouvé" });
      return;
    }
    res.json(projet);
  } catch (err) {
    next(err);
  }
};

const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, image_url, user_id } = req.body;
    if (!title || !user_id) {
      res.status(400).json({ error: "Titre et user_id requis" });
      return;
    }
    const projetId = await projetsRepository.create({
      title,
      description,
      image_url,
      user_id,
    });
    const newProjet = await projetsRepository.read(projetId);
    res.status(201).json(newProjet);
  } catch (err) {
    next(err);
  }
};

const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image_url, user_id } = req.body;
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    if (!title || !user_id) {
      res.status(400).json({ error: "Titre et user_id requis" });
      return;
    }
    const updated = await projetsRepository.update(id, {
      title,
      description,
      image_url,
      user_id,
    });
    if (!updated) {
      res.status(404).json({ error: "Projet non trouvé" });
      return;
    }
    const projet = await projetsRepository.read(id);
    res.json(projet);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    const deleted = await projetsRepository.delete(id);
    if (!deleted) {
      res.status(404).json({ error: "Projet non trouvé" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export default { browse, browseWithSkills, read, add, edit, destroy };
