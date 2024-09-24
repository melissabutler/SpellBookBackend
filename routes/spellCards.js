"use strict";

const express = require("express");

const { BadRequestError } = require("../expressError")
const SpellCard = require('../models/spellCard');
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth")

const router = express.Router();

/** Get a list of all created spell cards. 
 * 
 * Authorization required: Admin
 */
router.get("/", ensureAdmin, async function(req, res, next) {
    try {
        const spellcards = await SpellCard.findAll();
        return res.json({ spellcards })
    } catch(err) {
        return next(err);
    }
})

/** Post a new spell card
 * 
 */

router.post('/', ensureAdmin, async function(req, res, next) {
    try {
        const newSpellCard = await SpellCard.createSpellCard(req.body);
        return res.status(201).json({ newSpellCard })
    } catch(err) {
        return next(err);s
    }
})

module.exports = router;