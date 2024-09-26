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


/** GET :username/characters/:char_id */

describe("GET /users/:username/characters/:char_id", function () {
        test("works for admin", async function () {
                const resp = await request(app)
                .get(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${adminToken}`)
                expect(resp.body).toEqual({
                        character: {
                                username: 'u1',
                                char_name: 'char1',
                                char_class: 'cleric', 
                                lvl: 1,
                                id: testCharIds[0],
                                strength: 10,
                                dexterity: 10,
                                constitution: 10,
                                intelligence: 10,
                                wisdom: 10,
                                charisma: 10,
                                spells: [
                                        "test-idx",
                                ]}
                });
        });

        test("works for same user", async function() {
                const resp = await request(app)
                .get(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.body).toEqual({
                        character: {
                                username: 'u1',
                                char_name: 'char1',
                                char_class: 'cleric', 
                                lvl: 1,
                                id: testCharIds[0],
                                strength: 10,
                                dexterity: 10,
                                constitution: 10,
                                intelligence: 10,
                                wisdom: 10,
                                charisma: 10,
                                spells: [
                                        "test-idx",
                                ] }
                });
        });

        test("unauth for others", async function() {
                const resp = await request(app)
                .get(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${u2Token}`)
                expect(resp.statusCode).toEqual(401)
        });

        test("not found for no such username", async function() {
                const resp = await request(app)
                .get(`/users/u5/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(401);

        });
        test("not found for no such character", async function() {
                const resp = await request(app)
                .get(`/users/u5/characters/0`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(401);

        });
})

/** POST :username/characters */
describe("POST /users/:username/characters", function() {
        test("works for admin", async function() {
                const resp = await request(app)
                .post('/users/u1/characters')
                .set("authorization", `Bearer ${adminToken}`)
                .send({
                        username: 'u1',
                        char_name: 'newChar',
                        char_class: 'cleric', 
                        lvl: 1
                })
                expect(resp.body).toEqual({
                        newCharacter: {
                                username: 'u1',
                                characterName: 'newChar',
                                characterClass: 'cleric', 
                                id: expect.any(Number),
                                level: 1,
                                strength: 10,
                                dexterity: 10,
                                constitution: 10,
                                intelligence: 10,
                                wisdom: 10,
                                charisma: 10

                },
                });

        });
        test("works for same user", async function() {
                const resp = await request(app)
                .post('/users/u1/characters')
                .set("authorization", `Bearer ${u1Token}`)
                .send({
                        username: 'u1',
                        char_name: 'newChar',
                        char_class: 'cleric', 
                        lvl: 1
                })
                expect(resp.body).toEqual({
                        newCharacter: {
                                username: 'u1',
                                characterName: 'newChar',
                                characterClass: 'cleric', 
                                id: expect.any(Number),
                                level: 1,
                                strength: 10,
                                dexterity: 10,
                                constitution: 10,
                                intelligence: 10,
                                wisdom: 10,
                                charisma: 10

                },
                });

        });
        test("unauth for others", async function() {
                const resp = await request(app)
                .post('/users/u1/characters')
                .set("authorization", `Bearer ${u2Token}`)
                .send({
                        username: 'u1',
                        char_name: 'newChar',
                        char_class: 'cleric', 
                        lvl: 1
                })
                expect(resp.statusCode).toEqual(401)

        });
        test("unauth for anon", async function() {
                const resp = await request(app)
                .post('/users/u1/characters')
                .send({
                        username: 'u1',
                        char_name: 'newChar',
                        char_class: 'cleric', 
                        lvl: 1
                })
                expect(resp.statusCode).toEqual(401)

        });
        test("not found for no such username", async function() {
                const resp = await request(app)
                .post('/users/nope/characters')
                .set("authorization", `Bearer ${u2Token}`)
                .send({
                        username: 'u1',
                        char_name: 'newChar',
                        char_class: 'cleric', 
                        lvl: 1
                })
                expect(resp.statusCode).toEqual(401)
        });     
})

/**PATCH :username/characters/:char_id */
describe("PATCH /users/:username/characters/:char_id", function () {
        test("works for admins", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/${testCharIds[0]}`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: 2
                })
                .set("authorization", `Bearer ${adminToken}`)
                expect(resp.body).toEqual({
                        character: {
                          char_class: "cleric",
                          char_name: "updated",
                          id: testCharIds[0],
                          lvl: 2
                        },
                      });

        });
        test("works for same user", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/${testCharIds[0]}`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: 2
                })
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.body).toEqual({
                        character: {
                          char_class: "cleric",
                          char_name: "updated",
                          id: testCharIds[0],
                          lvl: 2
                        },
                      });
                
        });
        test("doesnt work for others", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/${testCharIds[0]}`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: 2
                })
                .set("authorization", `Bearer ${u2Token}`)
                expect(resp.statusCode).toEqual(401)
                
        });
        test("doesnt work for anon", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/${testCharIds[0]}`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: 2
                })
                
                expect(resp.statusCode).toEqual(401)
                
        });
        test("not found if no such character", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/0`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: 2
                })
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(404)
                
                
        });
        test("bad request if invalid data", async function() {
                const resp = await request(app)
                .patch(`/users/u1/characters/${testCharIds[0]}`)
                .send({
                        char_name: "updated",
                        char_class: "cleric",
                        lvl: "Woah"
                })
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(400)
                
        });

})

/** DELETE :username/characters/:char_id */
describe("DELETE /users/:username/characters/:char_id", function () {
        test("works for admin", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${adminToken}`)
                expect(resp.body).toEqual({deleted: `${testCharIds[0]}`})

        })
        test("works for user", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.body).toEqual({deleted: `${testCharIds[0]}`})
                
        })
        test("unauth for other", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}`)
                .set("authorization", `Bearer ${u2Token}`)
                expect(resp.statusCode).toEqual(401)
                
        })
        test("unauth for anon", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/${testCharIds[0]}`)
                expect(resp.statusCode).toEqual(401)
                
        })
        test("not found if user missing", async function() {
                const resp = await request(app)
                .delete(`/users/u1/characters/0`)
                .set("authorization", `Bearer ${u1Token}`)
                expect(resp.statusCode).toEqual(404)
                
        })
})
