import useSWR from "swr";

async function FetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedStatus />
    </>
  );
}

function UpdatedStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", FetchApi, {
    refreshInterval: 1000,
    dedupingInterval: 1000,
  });
  let updatedAtText = "Carregando...";

  let maxConnectionsText = "Carregando...";
  let openedConnectionsText = "Carregando...";
  let versionText = "Carregando...";

  if (!isLoading && data) {
    const updatedAt = data.updated_at;
    const { max_connections, opened_connections, version } =
      data.dependencies.database;

    updatedAtText = new Date(updatedAt).toLocaleString("pt-BR");
    maxConnectionsText = max_connections;
    openedConnectionsText = opened_connections;
    versionText = version;
  }

  return (
    <div>
      <h2>Última Atualização {updatedAtText}</h2>
      <table style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th>Máximo de Conexões</th>
            <th>Conexões Abertas</th>
            <th>Versão</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{maxConnectionsText}</td>
            <td>{openedConnectionsText}</td>
            <td>{versionText}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
