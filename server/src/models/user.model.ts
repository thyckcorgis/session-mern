import mongoose from "mongoose";
import { compare, hash } from "bcrypt";

export interface IUserDocument extends mongoose.Document {
  username: string;
  password: string;
  email: string;
  comparePasswords(password: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
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

UserSchema.pre<IUserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.statics.doesNotExist = async function (field): Promise<boolean> {
  return (await this.where(field).countDocuments()) === 0;
};

UserSchema.methods.comparePasswords = function (password: string) {
  return compare(password, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
