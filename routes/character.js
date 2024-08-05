"use strict";

const express = require('express')

const { BadRequestError } = require("../expressError")
const Character = require("../models/character")

const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const characters = await Character.findAll()
        return res.json({ characters })
    } catch(err){
        return next(err);
    }
})

router.post('/', async function (req, res, next) {
    try {
        const newCharacter = await Character.createCharacter(req.body);
        return res.status(201).json({ newCharacter })
    } catch(err) {
        return next(err);
    }
})

router.get("/:char_id", async function(req, res, next) {
    try {
        const character = await Character.get(req.params.char_id);
        return res.json({character})

    } catch(err) {
        return next(err);
    }
})

router.post('/:char_id/spell_cards/:idx', async function(req, res, next){
    try {
        const spellId = +req.params.idx;
        await Character.assignSpells(req.params.char_id, spellId);
        return res.json({ assigned: spellId })
    } catch(err) {
        return next(err);
    }
})



module.exports = router;