import path from "path";
import fs from "fs";
import "babel-polyfill";
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";
import bodyParser from "body-parser";
import { mongo } from "./mongo";

const PORT = 8080;
const app = express();

const router = express.Router();

const serverRenderer = (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
};
router.use("^/$", serverRenderer);

router.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

app.use(router);

app.use(bodyParser.json());

app.get("/todo", async (req, res) => {
  const todos = await mongo.getTodos();
  return res.send(todos);
});

app.post("/todo", async (req, res) => {
  const todoItem = req.body;
  mongo.insertTodoItem(todoItem);
  return res.sendStatus(201);
});

app.delete("/todo", async (req, res) => {
  const id = req.body.id;
  mongo.deleteTodo(id);
  return res.sendStatus(204);
});

app.patch("/todo", async (req, res) => {
  const todoItem = req.body;
  mongo.markTodo(todoItem);
  return res.sendStatus(202);
});

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});
