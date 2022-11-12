import dotenv from "dotenv";

dotenv.config();

const environment = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_URL,
};

export default environment;
