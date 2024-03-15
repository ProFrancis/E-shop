import ModelArticle from "../models/articles.model.js";

export const post = async (req, res) => {
  try {
    const article = await ModelArticle.create({ ...req.body });
    res.status(201).json({ message: "Article has been created!'", article });
  } catch (error) {
    console.log(error);
  }
};

export const getArticle = async (req, res) => {
  try {
    const articles = await ModelArticle.find();
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
  }
};

export const getArticleById = async (req, res) => {
  try {
    const article = await ModelArticle.findById(req.params.id);
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
};

export const deleteArticle = async (req, res) => {
  checkId(req, res);
  try {
    const articleDeleted = await ModelArticle.findByIdAndDelete(req.params.id);
    if (!articleDeleted) return res.status(404).json("Article not found !");
    res.status(200).json("articleDeleted");
  } catch (error) {
    console.log(error);
  }
};

export const updateArticle = async (req, res) => {
  checkId(req, res);
  try {
    const updateArticle = await ModelArticle.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updateArticle) return res.status(404).json("Article not found");
    res.status(200).json({
      message: "Article updated",
      updateArticle,
    });
  } catch (error) {
    console.log(error);
  }
};

const checkId = (req, res) => {
  const lengthId = req.params.id.length;
  if (lengthId > 24 || lengthId < 24)
    return res.status(404).json("Article not found !");
};
