import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Skill = {
  id: number;
  name: string;
  image_url?: string;
};

type SkillInput = Omit<Skill, "id">;

class SkillsRepository {
  async readAll(): Promise<Skill[]> {
    const [rows] = await databaseClient.execute<Rows>(
      "SELECT * FROM skills ORDER BY name ASC",
    );
    return rows as Skill[];
  }

  async read(id: number): Promise<Skill | null> {
    const [rows] = await databaseClient.execute<Rows>(
      "SELECT * FROM skills WHERE id = ?",
      [id],
    );
    const skills = rows as Skill[];
    return skills.length > 0 ? skills[0] : null;
  }

  async readByName(name: string): Promise<Skill | null> {
    const [rows] = await databaseClient.execute<Rows>(
      "SELECT * FROM skills WHERE name = ?",
      [name],
    );
    const skills = rows as Skill[];
    return skills.length > 0 ? skills[0] : null;
  }

  async create(skill: SkillInput): Promise<number> {
    const [result] = await databaseClient.execute<Result>(
      "INSERT INTO skills (name, image_url) VALUES (?, ?)",
      [skill.name, skill.image_url || null],
    );
    return result.insertId;
  }

  async update(id: number, skill: Partial<SkillInput>): Promise<boolean> {
    const fields = [];
    const values = [];

    if (skill.name !== undefined) {
      fields.push("name = ?");
      values.push(skill.name);
    }
    if (skill.image_url !== undefined) {
      fields.push("image_url = ?");
      values.push(skill.image_url);
    }

    if (fields.length === 0) {
      return false;
    }

    values.push(id);

    const [result] = await databaseClient.execute<Result>(
      `UPDATE skills SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await databaseClient.execute<Result>(
      "DELETE FROM skills WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }

  async search(searchTerm: string): Promise<Skill[]> {
    const [rows] = await databaseClient.execute<Rows>(
      "SELECT * FROM skills WHERE name LIKE ? ORDER BY name ASC",
      [`%${searchTerm}%`],
    );
    return rows as Skill[];
  }
}

export default new SkillsRepository();
