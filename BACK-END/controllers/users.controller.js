import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { env } from "../config/index.js";
import ModelUser from "../models/users.model.js";

export const signup = async (req, res) => {
  try {
    // hashage du mot de passe
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // création d un nouvel utilisateur ds la bdd
    const user = await ModelUser.create({
      ...req.body,
      password: hashedPassword,
    });

    // Réponse avec le status
    res.status(201).json({ message: "'User has been created!'", user });
  } catch (error) {
    console.log(error);
  }
};

export const sign = async (req, res) => {
  try {
    // Recherche l'user dans la base de données pas son email
    const user = await ModelUser.findOne({ email: req.body.email })
    // Si l'user n'est pas trouvé, renvoie une erreur 404.
    if(!user) return res.status(404).json("User not found !")

    // Compare le mot de passe fourni dans la requête 
		// avec le mot de passe de l'utilisateur (qui est dans la bdd)
    const comparePassword = await bcrypt.compare(req.body.password, user.password)
    // Si le mot de passe est incorrect, 
		// renvoie une erreur 400.
    if(!comparePassword) return res.status(400).json("Wrong Credentials!")

    const token = jwt.sign({ id: user._id } , env.token, { expiresIn: "24h"})

    // Supprime le mot de passe de l'user pour des raisons de sécurité.
    const { password, ...others } = user._doc 

    // envoie le jeton (token) JWT sous forme de cookie HTTPOnly
    res.cookie('access_token', token, {httpOnly: true})
    .status(200)
    .json(others)
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await ModelUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await ModelUser.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  checkId(req, res);
  try {
    const userDeleted = await ModelUser.findByIdAndDelete(req.params.id);
    if (!userDeleted) return res.status(404).json("User not found !");
    res.status(200).json("userDeleted");
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  checkId(req, res);
  try {
    const updateUser = await ModelUser.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updateUser) return res.status(404).json("User not found");
    res.status(200).json({
      message: "User updated",
      updateUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const checkId = (req, res) => {
  const lengthId = req.params.id.length;
  if (lengthId > 24 || lengthId < 24)
    return res.status(404).json("User not found !");
};
