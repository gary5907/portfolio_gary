import type { FieldPacket, ResultSetHeader } from "mysql2";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { UserType } from "../../../lib/definition";

class userRepository {
  async create(user: UserType) {
    const { firstname, lastname, email, password, id } = user;

    const [result]: [ResultSetHeader, FieldPacket[]] =
      await databaseClient.query<Result>(
        "INSERT INTO user (firstname, lastname, email, password, id) VALUES (?, ?, ?, ?, ?)",
        [user.firstname, user.lastname, user.email, user.password, user.id],
      );

    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );
    return rows[0] as UserType | undefined;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    return rows as UserType[];
  }

  async readByEmailWithPassword(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    return rows[0] as UserType;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT firstname FROM user WHERE email=?",
      [email],
    );
    return rows[0] as UserType | undefined;
  }
}

export default new userRepository();
