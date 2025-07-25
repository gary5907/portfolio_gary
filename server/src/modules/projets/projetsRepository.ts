import type { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../../../database/client";

export type Projet = {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  user_id: number;
};

type Skill = {
  id: number;
  name: string;
  image_url?: string;
};

export type ProjetWithSkills = Projet & { skills: Skill[] };

class ProjetsRepository {
  async create(projet: Omit<Projet, "id">) {
    const { title, description, image_url, user_id } = projet;
    const [result]: [ResultSetHeader, FieldPacket[]] =
      await db.query<ResultSetHeader>(
        "INSERT INTO projets (title, description, image_url, user_id) VALUES (?, ?, ?, ?)",
        [title, description, image_url ?? null, user_id],
      );
    return result.insertId;
  }

  async read(id: number) {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query<
      RowDataPacket[]
    >("SELECT * FROM projets WHERE id = ?", [id]);
    return rows[0] as Projet | undefined;
  }

  async readAll() {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query<
      RowDataPacket[]
    >("SELECT * FROM projets ORDER BY id DESC");
    return rows as Projet[];
  }

  async update(id: number, projet: Omit<Projet, "id">) {
    const { title, description, image_url, user_id } = projet;
    const [result]: [ResultSetHeader, FieldPacket[]] =
      await db.query<ResultSetHeader>(
        "UPDATE projets SET title = ?, description = ?, image_url = ?, user_id = ? WHERE id = ?",
        [title, description, image_url ?? null, user_id, id],
      );
    return result.affectedRows;
  }

  async delete(id: number) {
    const [result]: [ResultSetHeader, FieldPacket[]] =
      await db.query<ResultSetHeader>("DELETE FROM projets WHERE id = ?", [id]);
    return result.affectedRows;
  }

  async readAllWithSkills(): Promise<ProjetWithSkills[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query<
      RowDataPacket[]
    >(
      `SELECT 
        p.id, p.title, p.description, p.image_url, p.user_id,
        s.id AS skill_id, s.name AS skill_name, s.image_url AS skill_image_url
      FROM projets p
      INNER JOIN projets_skill ps ON p.id = ps.projet_id
      INNER JOIN skills s ON ps.skill_id = s.id
      ORDER BY p.id DESC`,
    );

    const projetsMap: Record<number, ProjetWithSkills> = {};
    for (const row of rows) {
      const projetId = row.id;
      if (!projetsMap[projetId]) {
        projetsMap[projetId] = {
          id: row.id,
          title: row.title,
          description: row.description,
          image_url: row.image_url,
          user_id: row.user_id,
          skills: [],
        };
      }
      if (row.skill_id && row.skill_name) {
        projetsMap[projetId].skills.push({
          id: row.skill_id,
          name: row.skill_name,
          image_url: row.skill_image_url,
        });
      }
    }
    return Object.values(projetsMap);
  }
}

export default new ProjetsRepository();
