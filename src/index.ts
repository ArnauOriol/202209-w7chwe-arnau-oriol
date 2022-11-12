import environment from "./loadEnvirontments.js";
import startServer from "./server/startServer.js";

// eslint-disable-next-line no-implicit-coercion
await startServer(+environment.port);
