import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const queryPostgresVersion = await database.query("SHOW server_version;");
  const postgresVersion = queryPostgresVersion.rows[0].server_version;

  const queryPostgresMaxConnections = await database.query(
    "SHOW max_connections;",
  );
  const postgresMaxConnections = parseInt(
    queryPostgresMaxConnections.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const queryPostgresOpenedConnections = await database.query({
    text: "SELECT COUNT(*) FROM pg_stat_activity WHERE datname = $1 AND state = 'active';",
    values: [databaseName],
  });
  const postgresOpenedConnections = parseInt(
    queryPostgresOpenedConnections.rows[0].count,
  );

  const reponseBody = {
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: postgresMaxConnections,
        opened_connections: postgresOpenedConnections,
        version: postgresVersion,
      },
    },
  };

  response.status(200).json(reponseBody);
}

export default status;
