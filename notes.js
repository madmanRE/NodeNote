require("dotenv").config();
const marked = require("marked");
const fs = require("fs");
const createPDF = require("./PDFHandler")

const express = require("express");

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



const notesRouter = express.Router();


notesRouter.get("/", async (req, res) => {
  try {
    const currentUser = req.session.user;
    const dbUser = await knex("users")
      .where({ username: currentUser.username, password: currentUser.password })
      .first();
    if (!dbUser) {
      console.error("authorization error");
      return res.redirect("/");
    }

    let query = knex("notes").where({ owner_id: dbUser.id });

    if (req.query.age === "1month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      query = query.where("createdAt", ">=", oneMonthAgo.toISOString());
    }

    if (req.query.age === "3months") {
      const threeMonthAgo = new Date();
      threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
      query = query.where("createdAt", ">=", threeMonthAgo.toISOString());
    }

    if (req.query.age === "archive") {
      query = query.where({ isArchived: true });
    }

    if (req.query.search) {
      query = query.where("title", "like", `%${req.query.search}%`);
    }

    const page = parseInt(req.query.page || 1, 10);
    const perPage = 20;
    const offset = (page - 1) * perPage;
    query = query.limit(perPage).offset(offset);
    const notes = await query;
    res.json(notes);
  } catch (e) {
    console.log(`error: ${e}`);
    return res.redirect("/");
  }
});

notesRouter.post("/", async (req, res) => {
  const user = req.session.user;

  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const newNote = {
    title: req.body.title,
    text: marked.parse(req.body.text),
    owner_id: dbUser.id,
  };

  try {
    await knex("notes").insert(newNote);
    const currentNewNote = await knex("notes").where({ title: newNote.title, text: newNote.text, owner_id: newNote.owner_id}).first();
    res.json(currentNewNote);
  } catch (error) {
    console.error("error while creating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notesRouter.get("/id", async (req, res) => {
  const user = req.session.user;
  const id = req.query.id;

  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const note = await knex("notes").where({ id: id, owner_id: dbUser.id }).first();

  if (note) {
    res.json(note)
  } else {
    res.status(404).json({ error: "No notes with such ID" });
  }
});

notesRouter.patch("/archive", async (req, res) => {
  const user = req.session.user;
  const id = req.body.id;

  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const note = await knex("notes").where({ id: id, owner_id: dbUser.id }).first();

  if (note) {
    if (note.isArchived === false) {
      await knex("notes").where({ id: id, owner_id: dbUser.id }).update({ isArchived: true });
    } else {
      await knex("notes").where({ id: id, owner_id: dbUser.id }).update({ isArchived: false });
    }
    res.json(note);
  } else {
    res.status(404).json({ error: "No notes with such ID" });
  }
});

notesRouter.patch("/update/:id", async (req, res) => {
  const user = req.session.user;
  const id = req.params.id;

  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const note = await knex("notes").where({ id: id, owner_id: dbUser.id }).first();
  if (note) {
    try {
      if (req.body.title) {
        note.title = req.body.title;
      }
      if (req.body.text) {
        note.text = req.body.text;
      }
      await knex("notes").where({ id: id, owner_id: dbUser.id }).update({ title: note.title, text: note.text });

      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(404).json({ error: "No notes with such ID" });
  }
});


notesRouter.delete("/delete/id", async (req, res) => {
  const user = req.session.user;
  const id = req.query.id;
  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const note = await knex("notes").where({ id: id, owner_id: dbUser.id }).first();

  if (note) {
    try {
      await knex("notes").where({ id: id, owner_id: dbUser.id }).delete();

      res.json({ message: "Note has been deleted" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(404).json({ error: "Note with such ID not found" });
  }
});


notesRouter.delete("/delete", async (req, res) => {
  const user = req.session.user;
  const all = req.body.all;
  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  if (all === "allArchived") {
    try {
      await knex("notes").where({ owner_id: dbUser.id, isArchived: true }).delete();

      res.status(201).json({ message: "All archived notes has benn deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(500).json({ error: "Something wrong!" });
  }
});

notesRouter.get("/topdf", async (req, res) => {
  const user = req.session.user;
  const id = req.query.id;
  const dbUser = await knex("users").where({ username: user.username, password: user.password }).first();

  const note = await knex("notes").where({ id: id, owner_id: dbUser.id }).first();

  if (note) {
    try {
      const filePath = createPDF(note.id, note.text);
      setTimeout(() => downloadNote(filePath, res), 3000);
      
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(404).json({ error: "Note with such ID not found" });
  }
});


function downloadNote(filePath, res) {
  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("file done");
        }
      });
    }
  });
}





module.exports = notesRouter;