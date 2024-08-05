"use strict";

const jsonschema = require("jsonschema");
const express= require("express");

const Spell = require('../models/spellCard')

const router = express.Router()

router.get("/", async function (req, res, next) {
    try {
        //adjust based on req
        const spells = await Spell.getAllSpells();
        return res.json({ spells })
    } catch(err) {
        return next(err);
    }
});

module.exports = router;