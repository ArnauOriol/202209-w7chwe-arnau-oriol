import express from "express";
import registerUser from "../controllers/usersControllers/usersControllers.js";

// eslint-disable-next-line new-cap
const usersRouter = express.Router();

usersRouter.post("/signup", registerUser);

export default usersRouter;
