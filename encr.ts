import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

const randomStr = randomBytes(16).toString("hex"); // 32-character random string
const hashed = await hash(randomStr, 10); // bcrypt-hashed version

console.log("Random String:", randomStr); // e.g. 32-char token
console.log("Hashed:", hashed);           // bcrypt hash (usually 60 chars)
