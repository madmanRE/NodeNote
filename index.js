require("dotenv").config();

const express = require("express");
const session = require("express-session");
const nunjucks = require("nunjucks");
const authRouter = require("./auth");
const notesRouter = require("./notes");

const app = express();

app.use(
  session({
    secret: "secret_000",
    resave: false,
    saveUninitialized: true,
  }),
);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRouter);
app.use("/api/notes", notesRouter);

app.get("/", (req, res) => {
  let user = req.session.user;
  if (!user) {
    res.render("index", { user });
  } else {
    res.redirect("/dashboard");
  }
});

app.get("/dashboard", (req, res) => {
  let user = req.session.user;
  if (!user) {
    res.redirect("/");
  } else {
    res.render("dashboard", { user });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});