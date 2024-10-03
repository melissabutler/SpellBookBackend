"use strict";

/** Express app for spellBook */
const express = require("express");
const cors = require("cors");

const morgan = require("morgan")

const { NotFoundError } = require("./expressError")

/** Routes */
const userRoutes = require('./routes/user')
const characterRoutes = require('./routes/character')
const authRoutes = require("./routes/auth");
const { authenticateJWT } = require("./middleware/auth");

const app = express();

app.use(cors({
    AccessControlOrigin: ["https://spellbookfrontend.onrender.com", "https://spellbookbackend.onrender.com"]
}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT)

app.use("/users", userRoutes)
app.use("/characters", characterRoutes)
app.use('/auth', authRoutes)

/** Handle 404 errors -- matches everything */ 
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic Error handler, anything unhandled goes here */
app.use(function (err, req, res, next){
    if(process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;