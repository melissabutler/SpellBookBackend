"use strict";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const User = require('../models/user.js')
const Character = require('../models/character.js')

const {
        commonBeforeAll,
        commonBeforeEach,
        commonAfterEach,
        commonAfterAll,
        testCharIds,
        u1Token,
        u2Token,
        adminToken,
    
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST :username/characters/:char_id/spell_cards/:idx */

/** DELETE :username/characters/:char_id/spell_cards/:idx */