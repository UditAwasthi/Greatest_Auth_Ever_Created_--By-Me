import bycrypt from "bcrypt";

export const hashPassword = (password) => {
    return bycrypt.hash(password,10)
}

export const comparePassword = (password, hash) => {
  return bycrypt.compare(password, hash);
};