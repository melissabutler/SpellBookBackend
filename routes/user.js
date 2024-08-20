"use strict";

const express = require("express");

const jsonschema = require("jsonschema");

const userRegisterSchema = require("../schemas/userRegister.json")
const userUpdateSchema = require("../schemas/userUpdate.json")


const { BadRequestError } = require("../expressError")
const User = require('../models/user');
const { createToken } = require("../helpers/tokens");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth")

const router = express.Router();

/** POST / { user } => { user, token } 
 * 
 * Adds a new user, for Admin use. 
 * 
 * returns a new user and auth token: 
 *  {user: { username, email, isAdmin }, token}
 * Authorization required: admin
 * 
 * 
*/
router.post('/', ensureAdmin, async function(req, res, next) {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if(!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }
    try {
        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
    } catch(err) {
        return next(err);
    }
});

/** GET / => { users: [ { username, email }, ... ] }
 * returns a list of all users
 * 
 * Authorization required: Admin
 */
router.get('/', ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch(err) {
        return next(err);
    }
})

/** GET /[username] => { user }
 * 
 * Returns { username, email, characters }
 *          where characters is { id, name, class, level }
 * 
 * Authorization: admin or same user-as-:username
 */

router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({user});
    } catch(err) {
        return next(err);
    }

})

/** PATCH /[username] { user } => { user }
 * 
 * Data can include:
 *  { password, email }
 * 
 * Authorization required: Admin or same-user-as-:username
 */

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if(!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }
    try {
        const user = await User.update(req.params.username, req.body);
        return res.json({ user })
    } catch(err) {
        return next(err);
    }
})
/** DELETE /[username] => { deleted: username }
 * 
 * Authorization required: admin or same-user-as-:username
 * 
 */

router.delete('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await User.delete(req.params.username);
        return res.json({ deleted: req.params.username});
    } catch(err) {
        return next(err);
    }
})


module.exports = router;