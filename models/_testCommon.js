const bcrypt = require('bcrypt');

const db = require('../db.js');
const { BCRYPT_WORK_FACTOR } = require("../config")
const testCharIds = [];
async function commonBeforeAll() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM characters");

    

    await db.query(`
        INSERT INTO users(username,
                          password,
                          email)
        VALUES ('u1', $1, 'u1@email.com'),
               ('u2', $2,'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

      const resultsChars = await db.query(`
        INSERT INTO characters(char_name, 
                                char_class, 
                                lvl, 
                                username)
        VALUES ('char1', 'cleric', 1, 'u1'),
                ('char2', 'druid', 1, 'u2')
        RETURNING id`);
        testCharIds.splice(0, 0, ...resultsChars.rows.map(r => r.id));
        
        await db.query(`
            INSERT INTO user_characters(char_id, username)
            VALUES($1, 'u1')`, [testCharIds[0]]);

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

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testCharIds
}