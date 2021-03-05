import { Router } from "express";

import User from "../models/user.model";
import { signUp } from "../validations/user";

const userRoutes = Router();

userRoutes.post("", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { error } = signUp.validate({ username, email, password });
    if (error) throw error;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.send({ userId: newUser.id, username });
  } catch (err) {
    res.status(400).send(err);
  }
});

export default userRoutes;
