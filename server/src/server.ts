import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { userRoutes } from "./routes";
import { PORT, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME, NODE_ENV } from "./config";

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");

    mongoose.connection;
    const app = express();

    app.disable("x-powered-by");

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          mongoOptions: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          },
          collectionName: "session",
          ttl: parseInt(SESS_LIFETIME.toString()) / 1000,
        }),
        cookie: {
          sameSite: true,
          secure: NODE_ENV === "production",
          maxAge: parseInt(SESS_LIFETIME.toString()),
        },
      })
    );

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/users", userRoutes);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}

main();
