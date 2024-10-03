"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "catbutts";

const PORT = +process.env.PORT || 3001;

//use dev database, testing database, or via env variable, production database

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
    ? "postgresql:///spellBook_test"
    : process.env.DATABASE_URL || "postgresql://melissabutler:catbutts@127.0.0.1:5432/spellBook"
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
