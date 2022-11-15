import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  Credentials,
  RegisterData,
  UserTokenPayload,
} from "../../types/types";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";
import environment from "../../../loadEnvirontments.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;

  try {
    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: passwordHashed,
    });

    res
      .status(201)
      .json({ message: `User ${newUser.username} successfully created` });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error on registration"
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new CustomError(
      "Username not found",
      401,
      "Wrong credentials"
    );
    next(error);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      "Password is incorrect",
      401,
      "Wrong credentials"
    );

    next(error);
    return;
  }

  const tokenPayload: UserTokenPayload = {
    id: user._id.toString(),
    username,
  };

  const token = jwt.sign(tokenPayload, environment.jwtSecret);

  res.status(200).json({ accessToken: token });
};
