import { Request } from "express";
import { Session } from "express-session";

interface SessionUser extends Session {
  user?: {
    username: string;
    userId: string;
  };
}

export interface SessionReq extends Request {
  session: SessionUser;
}
