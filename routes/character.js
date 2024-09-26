"use strict";

const express = require('express')

const { BadRequestError } = require("../expressError")
const Character = require("../models/character")
const { ensureAdmin, ensureCorrectUserOrAdmin } = require('../middleware/auth')

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

router.get('/', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const characters = await Character.findAll()
        return res.json({ characters })
    } catch(err){
        return next(err);
    }
})



module.exports = router;