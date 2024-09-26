"use strict";

const request = require("supertest");
const db = require('../db.js');
const app = require('../app');
const User = require('../models/user.js')

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

/**POST  */
describe("POST /users", function() {
        test("works for admin: create non-admin", async function() {
                const resp = await request(app)
                .post('/users')
                .send({
                        username: 'u-new',
                        password: "password-new",
                        email: 'new@email.com',
                        isAdmin: false
                })
                .set("authorization", `Bearer ${adminToken}`);
                expect(resp.statusCode).toEqual(201);
                expect(resp.body).toEqual({
                        user: {
                                username: 'u-new',
                                email: 'new@email.com',
                                isAdmin: false,
                        }, token: expect.any(String)
                });
        });

        test("works for admin: create admin", async function() {
                const resp = await request(app)
                .post('/users')
                .send({
                        username: 'u-new',
                        password: "password-new",
                        email: 'new@email.com',
                        isAdmin: true
                })
                .set("authorization", `Bearer ${adminToken}`);
                expect(resp.statusCode).toEqual(201);
                expect(resp.body).toEqual({
                        user: {
                                username: 'u-new',
                                email: 'new@email.com',
                                isAdmin: true,
                        }, token: expect.any(String)
                });
        });

        test("unauth for users", async function () {
                const resp = await request(app)
                .post("/users")
                .send({
                        username: "u-new",
                        firstName: "First-new",
                        email: "new@email.com",
                        isAdmin: true,
                })
                .set("authorization", `Bearer ${u1Token}`);
            expect(resp.statusCode).toEqual(401); 
        });

        test("unauth for anon", async function () {
                const resp = await request(app)
                .post("/users")
                .send({
                        username: "u-new",
                        password: "password-new",
                        email: "new@email.com",
                        isAdmin: true,
                });
                expect(resp.statusCode).toEqual(401);
        });

        test("bad request if invalid data", async function () {
                const resp = await request(app)
                .post("/users")
                .send({
                        username: "u-new",
                        password: "password-new",
                        email: "not-an-email",
                        isAdmin: true,
                })
                .set("authorization", `Bearer ${adminToken}`);
                expect(resp.statusCode).toEqual(400);
        })
});
/** GET */
describe("GET /users", function () {
        test("works for admins", async function() {
                const resp = await request(app)
                .get('/users')
                .set("authorization", `Bearer ${adminToken}`);
                expect(resp.body).toEqual({
                        users: [
                        {
                                username: "u1",
                                email: "user1@user.com",
                                isAdmin: false
                        },
                        {
                                username: "u2",
                                email: "user2@user.com",
                                isAdmin: false
                        },
                        {
                                username: "u3",
                                email: "user3@user.com",
                                isAdmin: false
                        }
                        ],
                });
        });

        test("unauth for non-admin users", async function () {
                const resp = await request(app)
                .get("/users")
                .set("authorization", `Bearer ${u1Token}`);
                expect(resp.statusCode).toEqual(401);
        });

        test("unauth for anon", async function () {
                const resp = await request(app)
                    .get("/users");
                expect(resp.statusCode).toEqual(401);
              });
            
        test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query("DROP TABLE users CASCADE");
        const resp = await request(app)
                .get("/users")
                .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(500);
        });

})


/** GET :username */
describe("GET /users/:username", function () {
        test("works for admin", async function () {
          const resp = await request(app)
              .get(`/users/u1`)
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.body).toEqual({
            user: {
              username: "u1",
              email: "user1@user.com",
              isAdmin: false,
              characters: [
                {
                        char_class: "cleric",
                        char_name: "char1",
                        id: testCharIds[0],
                        lvl: 1,
                }],
            },
          });
        });
      
        test("works for same user", async function () {
          const resp = await request(app)
              .get(`/users/u1`)
              .set("authorization", `Bearer ${u1Token}`);
          expect(resp.body).toEqual({
            user: {
              username: "u1",
              email: "user1@user.com",
              isAdmin: false,
              characters: [
                {
                        char_class: "cleric",
                        char_name: "char1",
                        id: testCharIds[0],
                        lvl: 1,
                },
                ]},
          });
        });
      
        test("unauth for other users", async function () {
          const resp = await request(app)
              .get(`/users/u1`)
              .set("authorization", `Bearer ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
      
        test("unauth for anon", async function () {
          const resp = await request(app)
              .get(`/users/u1`);
          expect(resp.statusCode).toEqual(401);
        });
      
        test("not found if user not found", async function () {
          const resp = await request(app)
              .get(`/users/nope`)
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.statusCode).toEqual(404);
        });
      });

/** PATCH :username */
describe("PATCH /users/:username", () => {
        test("works for admins", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                email: "new@email.com",
              })
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.body).toEqual({
            user: {
              username: "u1",
              email: "new@email.com"
            },
          });
        });
      
        test("works for same user", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                email: "new@email.com",
              })
              .set("authorization", `Bearer ${u1Token}`);
          expect(resp.body).toEqual({
            user: {
              username: "u1",
              email: "new@email.com"
            },
          });
        });
      
        test("unauth if not same user", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                email: "new@email.com",
              })
              .set("authorization", `Bearer ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
      
        test("unauth for anon", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                email: "new@email.com"
              });
          expect(resp.statusCode).toEqual(401);
        });
      
        test("not found if no such user", async function () {
          const resp = await request(app)
              .patch(`/users/nope`)
              .send({
                email: "new@email.com"
              })
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.statusCode).toEqual(404);
        });
      
        test("bad request if invalid data", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                email: "new"
              })
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.statusCode).toEqual(400);
        });
      
        test("works: can set new password", async function () {
          const resp = await request(app)
              .patch(`/users/u1`)
              .send({
                password: "new-password",
              })
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.body).toEqual({
            user: {
              username: "u1",
              email: "user1@user.com"
            },
          });
          const isSuccessful = await User.authenticate("u1", "new-password");
          expect(isSuccessful).toBeTruthy();
        });
      });

/** DELETE */
describe("DELETE /users/:username", function () {
        test("works for admin", async function () {
          const resp = await request(app)
              .delete(`/users/u1`)
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.body).toEqual({ deleted: "u1" });
        });
      
        test("works for same user", async function () {
          const resp = await request(app)
              .delete(`/users/u1`)
              .set("authorization", `Bearer ${u1Token}`);
          expect(resp.body).toEqual({ deleted: "u1" });
        });
      
        test("unauth if not same user", async function () {
          const resp = await request(app)
              .delete(`/users/u1`)
              .set("authorization", `Bearer ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
      
        test("unauth for anon", async function () {
          const resp = await request(app)
              .delete(`/users/u1`);
          expect(resp.statusCode).toEqual(401);
        });
      
        test("not found if user missing", async function () {
          const resp = await request(app)
              .delete(`/users/nope`)
              .set("authorization", `Bearer ${adminToken}`);
          expect(resp.statusCode).toEqual(404);
        });
      });