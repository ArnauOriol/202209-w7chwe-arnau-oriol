import express from "express";
import registerUser from "../controllers/usersControllers/registerUser.js";

const usersRouer = express();

usersRouer.post("/signup", registerUser);

export default usersRouer;
