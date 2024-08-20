"use strict";

const express = require('express')

const { BadRequestError } = require("../expressError")
const Character = require("../models/character")

const jsonschema = require("jsonschema")

const characterEditSchema = require("../schemas/characterEdit.json")

const router = express.Router();

/** GET
 * 
 * Returns a list of all characters, for Admin use. 
 * 
 * Returns list of characters and their users.
 * { id, char_name, username }
 */

router.get('/', async function(req, res, next) {
    try {
        const characters = await Character.findAll()
        return res.json({ characters })
    } catch(err){
        return next(err);
    }
})

/** POST
 * 
 * Creates a new character and adds to user. 
 * 
 * returns new character: { character: {char_id, char_name, char_class, level}}
 */

router.post('/', async function (req, res, next) {
    try {
        const newCharacter = await Character.createCharacter(req.body);
        return res.status(201).json({ newCharacter })
    } catch(err) {
        return next(err);
    }
})

/** GET
 * 
 * Gets information on a specific character
 * 
 * returns { id, char_name, char_class, lvl, spell_list }
 */

router.get("/:char_id", async function(req, res, next) {
    try {
        const character = await Character.get(req.params.char_id);
        return res.json({ character })

    } catch(err) {
        return next(err);
    }
})

/** PATCH /[char_id] { character } => { character }
 * 
 * Data can include { char_name, char_class, lvl }
 * 
 * Authorization required: Admin or same-user-as username
 */

router.patch("/:char_id", async function (req, res, next) {
    const validator = jsonschema.validate(req.body, characterEditSchema);
    if(!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs)
    }

    try {
        const character = await Character.update(req.params.char_id, req.body);
        return res.json({ character })
    } catch(err) {
        return next(err);
    }
})

/** DELETE
 * 
 * Deletes character from DB
 * 
 * returns "Deleted"
 */
router.delete("/:char_id", async function(req, res, next) {
    try {
        await Character.delete(req.params.char_id);
        return res.json({ deleted: req.params.char_id});
    } catch(err){
        return next(err);
    }
})

/** POST 
 * 
 * Adds spell to character spell list
 */

router.post('/:char_id/spell_cards/:idx', async function(req, res, next){
    try {
        const spellIdx = req.params.idx;
        console.log(req.params)
        await Character.assignSpells(req.params.char_id, req.params.idx);
        return res.json({ assigned: spellIdx })
    } catch(err) {
        return next(err);
    }
})
/** DELETE
 * 
 * Removes spell from character spell list/
 */
router.delete("/:char_id/spell_cards/:idx", async function(req, res, next) {
    try {
        const spellIdx = req.params.idx;
        await Character.unassignSpells(req.params.char_id, req.params.idx);
        return res.json({ unassigned: spellIdx })
    } catch(err) {
        return next(err);
    }
})



module.exports = router;