"use strict";

/**Convenience middleware to handle common auth cases in routes */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate User.
 * 
 * If token is provided, verify it, and if valid, store token payload on res.locals.
 * 
 * It is not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader= req.headers && req.headers.authorization;
        if(authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err) {
        return next();
    }
}

/** Middleware to use when must be logged in 
 * 
 * if not, raises Unauthorized.
*/

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware to use when must be logged in AND admin.
 * 
 * If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
    try {
        if(!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError();
        }
        return next();
    } catch(err) {
        return next(err);
    }
}

/** Middleware to use  when must provide a valid admin token & match username provided as route param.
 * If not, raises Unauthorized
*/

function ensureCorrectUserOrAdmin( req, res, next ) {
    try {
        const user = res.locals.user;
        if(!(user && (user.isAdmin || user.username === req.params.username))) {
            throw new UnauthorizedError();
        }
        return next();
    } catch(err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin
}