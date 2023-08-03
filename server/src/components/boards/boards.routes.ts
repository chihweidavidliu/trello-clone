import express from "express";

export const boardsRouter = express.Router();

boardsRouter.get("/boards", async (req, res) => {
  res.status(200).json({
    status: 200,
    errors: null,
    data: {
      hello: false,
    },
  });
});
