import { Router } from "express";

import User from "../models/user.model";
import { signUp } from "../validations/user";
import { parseError, sessionizeUser } from "../util/helpers";
import { SessionReq } from "../util/types";

const userRouter = Router();

userRouter.post("", async (req: SessionReq, res) => {
  try {
    const { username, email, password } = req.body;
    const { error } = signUp.validate({ username, email, password });
    if (error) throw error;
    const newUser = new User({ username, email, password });
    const sessionUser = sessionizeUser(newUser);
    await newUser.save();
    req.session.user = sessionUser;
    res.send(sessionUser);
  } catch (err) {
    res.status(400).send(parseError(err));
  }
});

export default userRouter;
