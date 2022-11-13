import express from "express";
import registerUser from "../controllers/usersControllers/registerUser.js";

// eslint-disable-next-line new-cap
const usersRouer = express.Router();

usersRouer.post("/signup", registerUser);

export default usersRouer;
