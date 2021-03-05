import { User } from "../types";

export const signup = (user: User) =>
  fetch("api/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const login = (user: User) =>
  fetch("api/session", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const logout = () => fetch("api/session", { method: "DELETE" });
