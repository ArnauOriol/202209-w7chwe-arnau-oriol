import connectDatabase from "./database/connectDatabase.js";
import environment from "./loadEnvirontments.js";
import startServer from "./server/startServer.js";

// eslint-disable-next-line no-implicit-coercion
await startServer(+environment.port);
await connectDatabase(environment.databaseUrl);
