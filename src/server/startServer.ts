import "../loadEnvirontments.js";
import debugCreator from "debug";
import app from "./app.js";

const debug = debugCreator("fakebook:server:root");

const startServer = async (port: number) => {
  await new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(`Server listening on port ${port}`);
      resolve(server);
    });

    server.on("error", (error) => {
      debug(`There was an error in server ${error.message}`);
      reject(error);
    });
  });
};

export default startServer;
