import express from "express";
import config from "./config";
import "./database";
const app = express();

// Config
config(app);

app.listen(6000, () =>
  console.log("El servidor ha sido inicializado: http://localhost:6060")
);
