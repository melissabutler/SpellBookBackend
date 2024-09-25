"use strict";

const db = require('../db')
const Character = require('./character.js')
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testCharIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**Related functions for characters */

/** Find All */
 describe("findAll", function() {
    test("works", async function(){
        const res = await Character.findAll();
        expect(res).toEqual([
            {
                id: testCharIds[0],
                char_name: "char1",
                username: 'u1'
            },
            {
                id: testCharIds[1],
                char_name: "char2",
                username: 'u2'
            }

        ])
    });
 })

/** Get */
describe("get", function () {
    test("works", async function(){
        let char = await Character.get(testCharIds[0]);
        expect(char).toEqual({
            id: testCharIds[0],
            char_name: "char1",
            char_class: "cleric",
            lvl: 1,
            username: "u1",
            strength: null,
            dexterity: null,
            constitution: null,
            intelligence: null,
            wisdom: null,
            charisma: null,
            spells: []
        })
    });
    test("returns not found if no such character", async function() {
        try {
            let char = await Character.get(0);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }

    })
})

/** Create Character */
describe("create character", function () {
    let newChar = {
        username: 'u1',
        char_name: 'newChar',
        char_class: 'cleric', 
        lvl: 1
    }

    let newCharStats = {
        username: 'u1',
        char_name: 'newChar',
        char_class: 'cleric', 
        lvl: 1,
        strength: 11,
        dexterity: 11,
        constitution: 11,
        wisdom: 11,
        intelligence: 11,
        charisma: 11,
    }

    let newCharFail = {
        username: 'u1',
        char_name: 'newChar',
        char_class: 'cleric', 
        lvl: 1,
        strength: 21,
        dexterity: 21,
        constitution: 21,
        wisdom: 21,
        intelligence: 21,
        charisma: 21,
    }

    test("default works", async function() {
        let char = await Character.createCharacter(newChar);
        expect(char).toEqual({
            username: 'u1',
            characterClass: "cleric",
            characterName: "newChar",
            charisma: 10,
            constitution: 10,
            dexterity: 10,
            intelligence: 10,
            level: 1,
            strength: 10,
            wisdom: 10,
            id: expect.any(Number),
        });
    });

    test("works with filled stats", async function () {
        let char = await Character.createCharacter(newCharStats);
        expect(char).toEqual({
            username: 'u1',
            characterClass: "cleric",
            characterName: "newChar",
            charisma: 11,
            constitution: 11,
            dexterity: 11,
            intelligence: 11,
            level: 1,
            strength: 11,
            wisdom: 11,
            id: expect.any(Number),
        })
    });

})

/** Update */
describe("update character", function () {
    const updateData = {
        char_name: "updated"
    }
    test("works", async function() {
        let res = await Character.update(testCharIds[0], updateData);
        expect(res).toEqual({
            char_class: "cleric",
            char_name: "updated",
            id: testCharIds[0],
            lvl: 1
        })
        

    });
    test("not found if no such character", async function() {
        try {
            await Character.update(0, updateData);
            fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }

    });
    test("bad request if no data", async function() {
        try {
            await Character.update(testCharIds[0], {});
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }

    });
})

/** Delete */
describe('delete character', function() {
    test("works", async function() {
        await Character.delete(testCharIds[0]);
            const res = await db.query(
                `SELECT * FROM characters WHERE id = $1`, [testCharIds[0]]
            );
            expect(res.rows.length).toEqual(0);
    });
    test("not found if no such character", async function() {
        try{
            await Character.delete(0);
        fail();
        } catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

/** Assign Spells
 * char_id, spell_idx
 */
describe("assign spell", function() {
    const spellIdx= "test-idx"
    test("works", async function() {
    await Character.assignSpells(testCharIds[0], spellIdx);
    const res = await db.query(
        `SELECT * FROM spell_lists WHERE char_id = $1 AND spell_idx = $2`, [testCharIds[0], spellIdx]
    )
    expect(res.rows).toEqual([{
        char_id: testCharIds[0],
        spell_idx: "test-idx"
    }])
    });

    test("fails if already assigned", async function() {
        try {
            await Character.assignSpells(testCharIds[0], spellIdx)
            await Character.assignSpells(testCharIds[0], spellIdx)
            fail();
        } catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })

    test("fails if no such character", async function() {
        try {
            await Character.assignSpells(0, spellIdx);
            fail();
    } catch(err) {
        expect(err instanceof NotFoundError).toBeTruthy();
    }
    })
})

/**Unassign spells */
describe("unassign spell", function() {
    const spellIdx= "test-idx"
    

    test("works", async function() {
    await Character.assignSpells(testCharIds[0], spellIdx);
    await Character.unassignSpells(testCharIds[0], spellIdx)
    const res = await db.query(
        `SELECT * FROM spell_lists WHERE char_id = $1 AND spell_idx = $2`, [testCharIds[0], spellIdx]
    )
    expect(res.rows.length).toEqual(0)
    });

    test("fails if no such character", async function() {
        try {
            await Character.unassignSpells(0, spellIdx);
            fail();
    } catch(err) {
        expect(err instanceof NotFoundError).toBeTruthy();
    }
    })
})