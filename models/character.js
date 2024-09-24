"use strict";

const db = require('../db');
const { sqlForPartialUpdate } = require("../helpers/sql")
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError")


class Character {

    /** GET
     * Return list of all characters, for admin use only
     */
    static async findAll() {
        const res = await db.query(
            `SELECT id,
                    char_name,
                    username
            FROM characters
            JOIN user_characters ON characters.id = user_characters.char_id
            ORDER BY id`
        );

        return res.rows;
    }

    /** GET
     * Return information about a single character.
     * 
     * Input { char_id }
     * Return { id, char_name, char_class, lvl, username, strength, dexterity, constitution, intelligence, wisdom, charisma }
     */

    static async get(char_id) {
        const res = await db.query(
            `SELECT id,
                    char_name,
                    char_class,
                    lvl,
                    username,
                    strength, 
                    dexterity,
                    constitution,
                    intelligence,
                    wisdom,
                    charisma
            FROM characters
            WHERE id = $1`, [char_id]
        );

        const character = res.rows[0];

        if(!character) throw new NotFoundError(`No character found.`)

        const spellListRes = await db.query(
            ` SELECT s.spell_idx, s.char_id FROM spell_lists s
                JOIN characters ON s.char_id = characters.id
                WHERE characters.id = $1`, [char_id]
        );
        character.spells = spellListRes.rows.map(a => a.spell_idx);
        console.log(character)
        return character;


    }

    /** Create a character from data, update db, return new character data.
     * 
     * Data should be { char_name, char_class, lvl, username, strength, dexterity, constitution, intelligence, widsom, charisma }
     */
static async createCharacter({ username, char_name, char_class, lvl, strength = 10, dexterity = 10, constitution = 10, intelligence = 10, wisdom = 10, charisma = 10 }) {
    const userResult = await db.query(
        `SELECT username
            FROM users
            WHERE username = $1`,
        [username],
    );

    const user = userResult.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const result = await db.query(
        `INSERT INTO characters (   char_name,
                                    char_class,
                                    lvl,
                                    username,
                                    strength, 
                                    dexterity,
                                    constitution,
                                    intelligence,
                                    wisdom,
                                    charisma)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, char_name AS "characterName", char_class AS "characterClass", lvl AS "level", username, strength, dexterity, constitution, intelligence, wisdom, charisma
        `,
        [char_name, char_class, lvl, username, strength, dexterity, constitution, intelligence, wisdom, charisma]
    );

    let character = result.rows[0];

    const connect = await db.query(
        `INSERT INTO user_characters ( char_id,
                                        username)
        VALUES ($1, $2)`, 
        [character.id, username]
    )


    return character;
}

/** Update character data with data, can be a partial update
 * 
 * Data can include { charName, class, lvl, strength, dexterity, constitution, intelligence, wisdom, charisma }
 * 
 * returns { charName, class }
 * 
 */
static async update(char_id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
            char_name: "char_name",
            char_class: "char_class",
            lvl: "lvl",
            strength: "strength",
            dexterity: "dexterity",
            constitution: "constitution",
            intelligence: "intelligence",
            wisdom: "wisdom",
            charisma: "charisma"
        }
    );

    const char_idVarIdx = "$" + (values.length + 1)

    const querySQL = ` UPDATE characters
                        SET ${setCols}
                        WHERE id = ${char_idVarIdx}
                        RETURNING id,
                                char_name,
                                char_class,
                                lvl`;
    const result = await db.query(querySQL, [...values, char_id]);
    const character = result.rows[0];

    if(!character) throw new NotFoundError(`Character not found.`);
    return character;
}

/**  */

/** Delete character 
 * 
 * Takes { char_id }
 * Returns { char_name }
*/


static async delete(char_id) {
    const result = await db.query(
    `DELETE FROM characters
    WHERE id = $1
    RETURNING char_name`,
    [char_id]);

    const character = result.rows[0]

    if(!character) throw new NotFoundError(`Character not found.`)
}

/** Assign a spell to a character's spell list
 * 
 * { char_id, spell_idx }
 */
static async assignSpells(char_id, spell_idx){

    const spellListResult = await db.query( 
        `SELECT char_id
                FROM spell_lists
                WHERE char_id = $1 AND spell_idx = $2`, [char_id, spell_idx]
    );
    if(spellListResult.rows.length != 0) throw new BadRequestError(`Spell ${spell_idx} already on character's list.`)

        console.log(spellListResult.rows)
    const result = await db.query(
        `INSERT INTO spell_lists (char_id,
                                    spell_idx)
        VALUES ($1, $2)
        RETURNING char_id, spell_idx`,
        [char_id, spell_idx]
    );

    let spell = result.rows[0];
    
    return spell;
}


/** Unassign spell, returns undefined.  */
static async unassignSpells(char_id, spell_idx){
    const result = await db.query(
        `DELETE FROM spell_lists
        WHERE char_id = $1 AND spell_idx = $2
        RETURNING spell_idx`,
        [char_id, spell_idx]
    );

    const spell = result.rows[0];

    if(!spell) throw new NotFoundError(`Spell not found.`)
}
    
}

module.exports = Character;