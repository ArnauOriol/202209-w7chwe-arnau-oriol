import type { Request, Response } from "express";

const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
};

export default notFoundError;
