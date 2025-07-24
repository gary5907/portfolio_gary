import type { RequestHandler } from "express";
import { type ZodSafeParseResult, z } from "zod";

interface ParsedNewSkillType {
  name: string;
  image_url?: string;
}

const validateSkill: RequestHandler = (req, res, next) => {
  const { name } = req.body;
  const image_url = req.file?.path;

  const parsedItems: ParsedNewSkillType = {
    name,
    image_url,
  };

  const skillSchema = z.object({
    name: z
      .string()
      .min(1, "Le nom est requis")
      .max(255, "Le nom ne peut pas dépasser 255 caractères"),
    image_url: z.string().optional(),
  });

  const validData: ZodSafeParseResult<ParsedNewSkillType> =
    skillSchema.safeParse({
      name,
      image_url,
    });

  if (!validData.success) {
    const errors: Record<string, string> = validData.error.issues.reduce<
      Record<string, string>
    >((acc, val) => {
      const key = String(val.path[0]);
      acc[key] = val.message;
      return acc;
    }, {});

    res.status(400).json({ "Skill validation errors:": errors });
    return;
  }

  req.body = parsedItems;
  next();
};

const validateSkillUpdate: RequestHandler = (req, res, next) => {
  const { name } = req.body;
  const image_url = req.file?.path;

  if (!name) {
    res.status(400).json({ error: "Le nom de la compétence est requis" });
    return;
  }

  const parsedItems: ParsedNewSkillType = {
    name: name.trim(),
    image_url,
  };

  const skillUpdateSchema = z.object({
    name: z
      .string()
      .min(1, "Le nom est requis")
      .max(255, "Le nom ne peut pas dépasser 255 caractères"),
    image_url: z.string().optional(),
  });

  const validData: ZodSafeParseResult<ParsedNewSkillType> =
    skillUpdateSchema.safeParse({
      name: parsedItems.name,
      image_url: parsedItems.image_url,
    });

  if (!validData.success) {
    const errors: Record<string, string> = validData.error.issues.reduce<
      Record<string, string>
    >((acc, val) => {
      const key = String(val.path[0]);
      acc[key] = val.message;
      return acc;
    }, {});

    res.status(400).json({ "Skill validation errors:": errors });
    return;
  }

  req.body = parsedItems;
  next();
};

export { validateSkill, validateSkillUpdate };
export default validateSkill;
