import { Router } from "express";

const userRoutes = Router();

userRoutes.post("", (req, res) => {
  res.send(req.body);
});

export default userRoutes;
