import database from "infra/database.js";
import { ValidationError } from "infra/errors/errors.js";

async function create(userDTO) {
  await validateUniqueUsername(userDTO.username);
  await validateUniqueEmail(userDTO.email);

  const newUser = await runInsertQuery(userDTO);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1);",
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Email informado já está em uso.",
        action: "Informe outro email.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: "SELECT email FROM users WHERE LOWER(username) = LOWER($1);",
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Username informado já está em uso.",
        action: "Informe outro username.",
      });
    }
  }

  async function runInsertQuery(userDTO) {
    const results = await database.query({
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      values: [userDTO.username, userDTO.email, userDTO.password],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
