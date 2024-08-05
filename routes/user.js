"use strict";

const express = require("express");

const { BadRequestError } = require("../expressError")
const User = require('../models/user');

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
// router.post('/', async function(req, res, next) {
//     try {
//         const
//     }
// })

/** GET / => { users: [ { username, email }, ... ] }
 * returns a list of all users
 * 
 * Authorization required: Admin
 */
router.get('/', async function (req, res, next) {
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

router.get('/:username', async function (req, res, next) {
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

/** DELETE /[username] => { deleted: username }
 * 
 * Authorization required: admin or same-user-as-:username
 * 
 */

/** POST /[username]/characters 
 * 
 * Retursn { "created": char_id }
 * 
 * Authorization required: admin or same-user-as-:username
 */

module.exports = router;