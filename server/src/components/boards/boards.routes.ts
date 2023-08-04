import express from "express";

export const boardsRouter = express.Router();

boardsRouter.get("/boards", async (req, res) => {
  res.status(200).json({
    errors: null,
    data: {
      hello: false,
    },
  });
});
