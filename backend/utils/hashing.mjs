import bcrypt from "bcrypt"


const SALT_ROUNDS = 10

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword
}

export const comparePassword =  (password, hashedPassword) => {
    return compareSync(password, hashedPassword)
}