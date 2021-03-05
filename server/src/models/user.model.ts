import mongoose from "mongoose";
import { compareSync, hashSync } from "bcrypt";

interface IUserDocument extends mongoose.Document {
  username: string;
  password: string;
  email: string;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  doesNotExist(user: object): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    username: {
      type: String,
      validate: {
        validator: (username: string) => User.doesNotExist({ username }),
        message: "Username already exists",
      },
    },
    email: {
      type: String,
      validate: {
        validator: (email: string) => User.doesNotExist({ email }),
        message: "Email already exists",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUserDocument>("save", function () {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, 10);
  }
});

UserSchema.statics.doesNotExist = async function (field): Promise<boolean> {
  return (await this.where(field).countDocuments()) === 0;
};

UserSchema.methods.comparePasswords = function (password: string): boolean {
  return compareSync(password, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
