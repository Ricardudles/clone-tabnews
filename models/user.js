import database from "../infra/database.js";

async function create(userDTO) {
  const results = await database.query({
    text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
    values: [userDTO.username, userDTO.email, userDTO.password],
  });

  return results.rows[0];
}

const user = {
  create,
};

export default user;
