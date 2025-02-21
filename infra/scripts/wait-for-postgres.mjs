import { exec } from "node:child_process";

let counter = 0;
let mementoMori = ["👶", "👦", "🧑", "🧓", "👴", "💀"];
let hourglass = ["⏳", "⌛", "⏳", "⌛", "⏳", "⌛"];

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(
        `\r${hourglass[counter % hourglass.length]}  ${
          mementoMori[counter % mementoMori.length]
        }  Awaiting Postgres warmup...`,
      );
      counter++;

      checkPostgres();
      return;
    }

    console.log(
      `\r${hourglass[counter % hourglass.length]}  ${
        mementoMori[counter % mementoMori.length]
      }  Postgres accepting new connections!`,
    );
  }
}

checkPostgres();
