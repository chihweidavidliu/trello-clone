import express from "express";
import { boardsRouter } from "./components/boards/boards.routes";

// TODO: create app factory
const app = express();

// TODO: cors

app.get("/healthcheck", async (req, res) => {
  res.status(200).send("Ok");
});

app.use(boardsRouter);

// TODO: config file
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
