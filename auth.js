require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const demoNote = require("./demoNote");

/*
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
*/

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydatabase.sqlite",
  },
  useNullAsDefault: true,
  migrations: {
    tableName: "knex_migrations",
  },
});

const authRouter = express.Router();

authRouter.use(bodyParser.urlencoded({ extended: false }));

const SALT = "secret_salt";

function getHash(password) {
  return crypto
    .createHash("sha256")
    .update(SALT + password)
    .digest("hex");
}

async function testNewUser(username, enteredPassword) {
  const user = await knex("users").where({username:username, password: enteredPassword }).first();
  if (user) {
    return false;
  }
  return true;
}


authRouter.post("/signup", async (req, res) => {
  const newUser = {
    username: req.body.username,
    password: getHash(req.body.password),
  };
  const userExists = await testNewUser(newUser.username, newUser.password);

  if (!userExists) {
    console.error("user already exists");
    res.status(409).send("user already exists");
    return res.redirect("/");
  }

  try {
    await knex("users").insert({
      username: newUser.username,
      password: newUser.password,
    });

    req.session.user = newUser;

    const dbUser = await knex("users").where({ username: newUser.username, password: newUser.password }).first();
    const demo = demoNote;
    demo.owner_id = dbUser.id;

    try {
      await knex("notes").insert(demo);

    } catch (error) {
      console.error("error while creating note:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.error("user_creation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


authRouter.post("/login", async (req, res) => {
  const username = req.body.username;
  const enteredPassword = req.body.password;

  const user = await knex("users")
    .where({ username: username, password: getHash(enteredPassword) })
    .first();
  if (user) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    req.session.user = null;
    res.redirect("/");
  }
});

authRouter.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

module.exports = authRouter;
