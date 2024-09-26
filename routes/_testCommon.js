"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Character = require("../models/character");
const { createToken } = require("../helpers/tokens");

const testCharIds = [];

async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM characters");


    await User.register({
        username: "u1",
        email: "user1@user.com",
        password: "password1",
        isAdmin: false
      });
      await User.register({
        username: "u2",
        email: "user2@user.com",
        password: "password2",
        isAdmin: false
      });
      await User.register({
        username: "u3",
        email: "user3@user.com",
        password: "password3",
        isAdmin: false
      });
      
      testCharIds[0] = (await Character.createCharacter ({
        username: 'u1',
        char_name: 'char1',
        char_class: 'cleric', 
        lvl: 1
      })).id;

      testCharIds[1] = (await Character.createCharacter ({
        username: 'u2',
        char_name: 'char2',
        char_class: 'druid', 
        lvl: 2
    })).id;

    await Character.assignSpells(testCharIds[0], "test-idx")
    await Character.assignSpells(testCharIds[1], 'test-idx')
}

async function commonBeforeEach() {
    await db.query("BEGIN")

}

async function commonAfterEach() {
    await db.query("ROLLBACK")

}

async function commonAfterAll() {
    await db.end();

}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testCharIds,
    u1Token,
    u2Token,
    adminToken,

}