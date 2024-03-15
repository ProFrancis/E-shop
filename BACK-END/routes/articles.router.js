import express from "express";

import {
  deleteArticle,
  getArticle,
  getArticleById,
  post,
  updateArticle,
} from "../controllers/articles.controllers.js";

const router = express.Router();

router.post("/add", post);
router.get("/get", getArticle);
router.get("/get/:id", getArticleById);
router.delete("/delete/:id", deleteArticle);
router.put("/update/:id", updateArticle);

export default router;
