"use strict";

const db = require('../db')
const User = require('./user.js')
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

console.log(testCharIds)
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/** Related functions for users */


    /** Authenticate */

    describe("authenticate", function() {
        test("works", async function() {
            const user = await User.authenticate('u1', 'password1');
            expect(user).toEqual({
                username: "u1",
                email: "u1@email.com",
                isAdmin: false
            });
        });
        test("unauth if no user", async function() {
            try { 
                await User.authenticate("nope", "password");
                fail();
            } catch(err) {
                expect(err instanceof UnauthorizedError).toBeTruthy();
            }
        });
        test("unauth if wrong password", async function() {
            try {
                await User.authenticate("u1", "wrong");
                fail();
            } catch(err) {
                expect(err instanceof UnauthorizedError).toBeTruthy();
            }
        });
        
    })
    /** Register */

    describe("register", function() {
        const newUser = {
            username: "new",
            email: "test@test.com",
            isAdmin: false,
        };

        test("works", async function() {
            let user = await User.register({
                ...newUser,
                password: "password",
            });
            expect(user).toEqual(newUser);
            const found = await db.query(`SELECT * FROM users WHERE username = 'new'`);
            expect(found.rows.length).toEqual(1);
            expect(found.rows[0].is_admin).toEqual(false);
            expect(found.rows[0].password.startsWith("$2b$")).toEqual(true)
        })
        test("bad request with duplicate data", async function() {
            try {
                await User.register({
                        ...newUser,
                        password: "password",
                });
                await User.register({
                    ...newUser,
                    password: "password",
                });
                fail();
            } catch(err) {
                expect(err instanceof BadRequestError).toBeTruthy();
            }

        })
    })
    

    /** FindAll */

    describe("findAll", function () {
        test("works", async function () {
          const users = await User.findAll();
          expect(users).toEqual([
            {
              username: "u1",
              email: "u1@email.com",
              isAdmin: false,
            },
            {
              username: "u2",
              email: "u2@email.com",
              isAdmin: false,
            },
          ]);
        });
      });

  

    /** Get */

    describe("get", function () {
        test("works", async function() {
            let user = await User.get("u1");
            expect(user).toEqual({
                username: "u1",
                email: "u1@email.com",
                isAdmin: false,
                characters: [
                    {
                        "char_class": "cleric",
                        "char_name": "char1",
                        "id": testCharIds[0],
                        "lvl": 1
                    }
                ]
            });
        });

        test("not found if no such user", async function () {
            try {
                await User.get("nope");
                fail();
            } catch(err) {
                expect(err instanceof NotFoundError).toBeTruthy();
            }
        })
    })
    

    /** Update
     */
    describe("update", function () {
        const updateData = {
            email: "new@email.com"
        };

        test("works", async function() {
            let res = await User.update("u1", updateData);
            expect(res).toEqual({
                username: 'u1',
                ...updateData
            });
        });

        test("works: set password", async function() {
            let res = await User.update("u1", {
                password: "new",
              });
              expect(res).toEqual({
                username: "u1",
                email: "u1@email.com",
              });
              const found = await db.query("SELECT * FROM users WHERE username = 'u1'");
              expect(found.rows.length).toEqual(1);
              expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
        });

        test("not found if no such user", async function() {
            try {
                await User.update("nope", {
                  email: "test@email.com",
                });
                fail();
              } catch (err) {
                expect(err instanceof NotFoundError).toBeTruthy();
              }
        });

        test("bad request if no data", async function () {
            expect.assertions(1);
            try {
              await User.update("c1", {});
              fail();
            } catch (err) {
              expect(err instanceof BadRequestError).toBeTruthy();
            }
          });
    })
   

    /** Deletes a user, returns undefined. */
    describe("delete", function() {
        test("works", async function() {
            await User.delete("u1");
            const res = await db.query(
                `SELECT * FROM users WHERE username = 'u1'`
            );
            expect(res.rows.length).toEqual(0);
        });

        test("not found if no such user", async function() {
            try{
                await User.delete('nope');
            fail();
            } catch(err) {
                expect(err instanceof NotFoundError).toBeTruthy();
            }
            
        })
    })    
