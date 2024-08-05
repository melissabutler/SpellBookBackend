"use strict";

const db = require('../db');
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
            JOIN userCharacters ON characters.id = userCharacters.char_id
            ORDER BY id`
        );

        return res.rows;
    }

    /** GET
     * Return information about a single character
     */

    static async get(char_id) {
        const res = await db.query(
            `SELECT id,
                    char_name,
                    char_class,
                    lvl
            FROM characters
            WHERE id = $1`, [char_id]
        );

        const character = res.rows[0];

        if(!character) throw new NotFoundError(`No character found.`)

        const spellListRes = await db.query(
            ` SELECT s.name FROM spell_cards s
                JOIN spellLists ON s.idx = spellLists.spell_idx`
        );

        character.spells = spellListRes.rows.map(a => a.name);
        return character;


    }

    /** Create a character from data, update db, return new character data.
     * 
     * Data should be { charName, class, user_id }
     */
static async createCharacter({ username, char_name, char_class, lvl }) {
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
                                    lvl)
        VALUES ($1, $2, $3)
        RETURNING id, char_name AS "characterName", char_class AS "characterClass", lvl AS "level"
        `,
        [char_name, char_class, lvl]
    );

    let character = result.rows[0];

    const connect = await db.query(
        `INSERT INTO userCharacters ( char_id,
                                        username)
        VALUES ($1, $2)`, 
        [character.id, username]
    )


    return character;
}

/** Update character data iwth data, can be a partial update
 * 
 * Data can include { charName, class }
 * 
 * returns { charName, class }
 * 
 */

/**  */

/** Delete character */

/** Unassign spell */

static async assignSpells(char_id, spell_idx){
    const charResult = await db.query( 
        `SELECT id 
                FROM characters
                WHERE id = $1`,
                [char_id],
    );

    let character = charResult.rows[0];

    const spellResult = await db.query( 
        `SELECT idx 
                FROM spell_cards
                WHERE idx = $1`, [spell_idx]
    )

    const result = await db.query(
        `INSERT INTO spellLists (id,
                                    spell_idx)
        VALUES ($1, $2)
        RETURNING id, spell_idx`,
        [char_id, spell_idx]
    );

    let spell = result.rows[0];
    
    return spell;
}

    
}

module.exports = Character;