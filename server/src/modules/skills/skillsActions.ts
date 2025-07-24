import type { RequestHandler } from "express";
import skillsRepository from "./skillsRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const skills = await skillsRepository.readAll();
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const skillId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(skillId)) {
      res.status(400).json({ error: "Invalid skill ID" });
      return;
    }

    const skill = await skillsRepository.read(skillId);

    if (skill == null) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }

    res.json(skill);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const imageSkill = req.file?.path;

    if (!name) {
      res.status(400).json({ error: "Skill name is required" });
      return;
    }

    const imageUrl = imageSkill
      ? `${req.protocol}://${req.get("host")}/${imageSkill.replace(/\\/g, "/")}`
      : undefined;

    const skillData = {
      name,
      image_url: imageUrl,
    };

    const skillId = await skillsRepository.create(skillData);
    const newSkill = await skillsRepository.read(skillId);

    res.status(201).json(newSkill);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const skillId = Number.parseInt(req.params.id, 10);
    const { name } = req.body;
    const imageSkill = req.file?.path;

    if (Number.isNaN(skillId)) {
      res.status(400).json({ error: "Invalid skill ID" });
      return;
    }

    if (!name) {
      res.status(400).json({ error: "Skill name is required" });
      return;
    }

    const existingSkill = await skillsRepository.read(skillId);
    if (!existingSkill) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }

    const skillData = {
      name,
      image_url: imageSkill || existingSkill.image_url || undefined, // 👈 AJOUTÉ || undefined
    };

    const updated = await skillsRepository.update(skillId, skillData);

    if (!updated) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }

    const updatedSkill = await skillsRepository.read(skillId);
    res.json(updatedSkill);
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const skillId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(skillId)) {
      res.status(400).json({ error: "Invalid skill ID" });
      return;
    }

    const deleted = await skillsRepository.delete(skillId);

    if (!deleted) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const search: RequestHandler = async (req, res, next) => {
  try {
    const { term } = req.params;

    if (!term || term.trim().length === 0) {
      res.status(400).json({ error: "Search term is required" });
      return;
    }

    const skills = await skillsRepository.search(term);
    res.json(skills);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  add,
  edit,
  destroy,
  search,
};
