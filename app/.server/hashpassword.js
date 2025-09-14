import bcrypt from "bcrypt";
import { addPerson } from "../model/database"; // or your DB logic

let SALT_ROUNDS = 12;

export async function createAccount(email, password, username, phone) {
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create person object
  let person = {
    email,
    username,
    phone,
    password: hashedPassword, // Store hashed password
  };

  // Store in database
  let result = await addPerson(person);

  return result; // or user object if needed
}
