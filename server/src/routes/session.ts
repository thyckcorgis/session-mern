import { Router } from "express";
import User from "../models/user.model";
import { signIn } from "../validations/user";
import { parseError, sessionizeUser } from "../util/helpers";
import { SessionReq } from "../util/types";
import { SESS_NAME } from "../config";

const sessionRouter = Router();

sessionRouter.post("", async (req: SessionReq, res) => {
  try {
    const { email, password } = req.body;
    signIn.validate({ email, password });
    const user = await User.findOne({ email });
    if (user?.comparePasswords(password)) {
      const sessionUser = sessionizeUser(user);

      req.session.user = sessionUser;
      res.send(sessionUser);
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (err) {
    res.status(401).send(parseError(err));
  }
});

sessionRouter.delete("", ({ session }: SessionReq, res) => {
  try {
    const user = session.user;
    if (user) {
      session.destroy((err) => {
        if (err) throw err;

        res.clearCookie(SESS_NAME);
        res.send(user);
      });
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(422).send(parseError(err));
  }
});

sessionRouter.get("", ({ session: { user } }: SessionReq, res) => {
  res.send({ user });
});

export default sessionRouter;
