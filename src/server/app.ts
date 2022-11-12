import express from "express";
import morgan from "morgan";
import { generalError, notFoundError } from "./middlewares/errors.js";
import usersRouer from "./routers/usersRouter.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouer);

app.use(notFoundError);
app.use(generalError);

export default app;
