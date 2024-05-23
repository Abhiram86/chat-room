import usersdb from "../models/users.js";
import express from "express";

const auth = express.Router();

auth.use(express.json());

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@(gmail\.com|email\.com)$/;
  return emailRegex.test(email);
}

// all users details
auth.get("/", async (req, res) => {
  const data = await usersdb.find({});
  res.json(data);
});

// registration
auth.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await usersdb.findOne({ username });
  if (user) {
    res.json({ error: "exists" });
  } else {
    const user = await usersdb.findOne({ email });
    if (user) return res.json({ error: "exists" });
    try {
      const new_user = new usersdb({
        username,
        email,
        password,
        rooms: [],
      });
      await new_user.save();
      res.json({
        msg: "Succesfull",
      });
    } catch (error) {
      res.json(error);
    }
  }
});

// sign-in
auth.post("/sign-in", async (req, res) => {
  const { identifier, password } = req.body;
  const isEmail = validateEmail(identifier);
  const query = isEmail ? { email: identifier } : { username: identifier };
  const user = await usersdb.findOne(query);
  if (user) {
    if (user.password === password) {
      res.json(user);
    } else {
      res.json({ error: "mismatch" });
    }
  } else {
    res.json({ erroe: "404" });
  }
});

export default auth;
