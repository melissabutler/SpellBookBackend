"use strict";

const db = require('../db');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError")

class SpellCard {

    /** GET
     * 
     * Return a list of all created spellcards, for admin use only
     */

    static async findAll() {
        const res = await db.query(
            `SELECT idx,
                    name,
                    description,
                    level,
                    range,
                    damage, 
                    area_of_effect,
                    school,
                    classes
            FROM spell_cards
            ORDER BY idx`
        );

        return res.rows;
    }

    /** Create a spell card and connect to associated character 
     * 
     * Data should be { idx, name, description, level, range, damage, area_of_effect, school, classes  }
    */
   static async createSpellCard({ idx, name, description, level, range = undefined, damage = undefined, area_of_effect = undefined, school = undefined, classes = undefined }){

        const spellCardResult = await db.query(
            `SELECT idx,
                    name, 
                    description,
                    level,
                    range,
                    damage, 
                    area_of_effect,
                    school,
                    classes
            FROM spell_cards
            WHERE idx = $1`,
            [idx]
        )

        let spellCard = spellCardResult.rows[0]

        if(spellCard){
            return new BadRequestError(`Spell card: ${name} Already exists`)
            next();
        }
            
    
        const result = await db.query(
            `INSERT INTO spell_cards ( idx, 
                                        name,
                                        description,
                                        level,
                                        range,
                                        damage, 
                                        area_of_effect,
                                        school,
                                        classes)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING idx AS "index", name, description, level, range, damage, area_of_effect, school, classes`,
            [idx, name, description, level, range, damage, area_of_effect, school, classes]
        )

        spellCard = result.rows[0];


        return spellCard;



   }
}

module.exports = SpellCard;