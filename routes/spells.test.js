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
describe("POST /users/:username/characters/spell_cards/:idx", function() {
        test("works for admin", async function() {
                const resp = await request(app)
                .post(`/users/u1/characters/${testCharIds[0]}/spell_cards/test_idx`)
                .set("authorization", `Bearer ${adminToken}`)
              
                expect(resp.body).toEqual({ assigned: "test_idx"});
        });
        test("works for same user", async function() { 
                const resp = await request(app)
                .post(`/users/u1/characters/${testCharIds[0]}/spell_cards/test_idx`)
                .set("authorization", `Bearer ${u1Token}`)
              
                expect(resp.body).toEqual({ assigned: "test_idx"});
        
        
        });
        test("unauth for others", async function() {
                const resp = await request(app)
                .post(`/users/u1/characters/${testCharIds[0]}/spell_cards/test_idx`)
                .set("authorization", `Bearer ${u2Token}`)
        
                expect(resp.statusCode).toEqual(401)

        });
        test("unauth for anon", async function() {
                const resp = await request(app)
                .post(`/users/u1/characters/${testCharIds[0]}/spell_cards/test_idx`)
        
                expect(resp.statusCode).toEqual(401)

        });
        test("not found for no such username", async function() {
                const resp = await request(app)
                .post(`/users/u1/characters/0/spell_cards/test_idx`)
                .set("authorization", `Bearer ${u1Token}`)
        
                expect(resp.statusCode).toEqual(404)
        });     
})

/** DELETE :username/characters/:char_id/spell_cards/:idx */
describe("DELETE /users/:username/characters/:char_id/spell_cards/:idx", function () {
        test("works for admin", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}/spell_cards/test-idx`)
                .set("authorization", `Bearer ${adminToken}`)
                expect(resp.body).toEqual({ "unassigned": "test-idx"})

        })
        test("works for user", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}/spell_cards/test-idx`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.body).toEqual({ "unassigned": "test-idx"})
                
        })
        test("unauth for other", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}/spell_cards/test-idx`)
                .set("authorization", `Bearer ${u2Token}`)
                expect(resp.statusCode).toEqual(401)
                
        })
        test("unauth for anon", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}/spell_cards/test-idx`)
                expect(resp.statusCode).toEqual(401)
                
        })
        test("not found if user missing", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/0/spell_cards/test-idx`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(404)
                
        })
})
