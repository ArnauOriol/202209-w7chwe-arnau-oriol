import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, notFoundError } from "./middlewares/errors.js";
import usersRouter from "./routers/usersRouter.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://202209-w7chwe-arnau-oriol-front.netlify.app",
      "http://localhost:3000",
      "http://localhost:4000",
    ],
  })
);

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
