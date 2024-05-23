import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import auth from "./routes/auth.js";
import room from "./routes/room.js";
import roomsdb from "./models/rooms.js";
import usersdb from "./models/users.js";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(
  cors({
    origin: "https://chat-room-cf9f.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-room-cf9f.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use("/auth", auth);
app.use("/room", room);

const PORT = 3001;
const DB_URL = process.env.DATABASE_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("mongodb not connected error is ", err);
  });

app.get("/", (req, res) => {
  res.json(
    "this is the backend for chat-room website running at https://chat-room-cf9f.vercel.app/"
  );
});

app.post("/roomdetails", async (req, res) => {
  try {
    const { roomids } = req.body;
    const rooms = await roomsdb.find({ _id: { $in: roomids } });
    if (!room) return res.json({ error: "404" });
    const roomdetails = rooms.map((room) => ({
      id: room._id,
      roomname: room.roomname,
      desc: room.description,
    }));
    return res.json(roomdetails);
  } catch (error) {
    console.error("Error retrieving room names:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/clear", async (req, res) => {
  const { roomid, username } = req.body;
  const user = await usersdb.findOne({ username });
  const room = await roomsdb.findById(roomid);
  if (!user || user._id.toString() !== room.createdBy.toString())
    return res.json({ error: "unathorized" });
  if (!room) return res.json({ error: "404" });
  room.messages = [];
  await room.save();
  res.json(room.messages);
});

app.patch("/self-remove", async (req, res) => {
  const { username, roomid } = req.body;
  const user = await usersdb.findOne({ username });
  if (!user) return res.json({ error: "404" });
  const room = await roomsdb.findById(roomid);
  if (!room) return res.json({ error: "404" });
  if (user._id.toString() === room.createdBy.toString())
    return res.json({ error: "creator" });
  try {
    room.members.remove(user._id);
    await room.save();
    user.rooms.remove(room._id);
    await user.save();
    return res.json({ msg: "succesfull" });
  } catch (error) {
    return res.json({ error: "404" });
  }
});

app.post("/get-users", async (req, res) => {
  const { roomid } = req.body;
  const room = await roomsdb.findById(roomid);
  if (!room) return res.json({ error: "404" });
  const userids = room.members;
  const users = await usersdb.find({ _id: { $in: userids } });
  const usernames = users.map((user) => user.username);
  res.json(usernames);
});

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("join-room", (roomid) => {
    socket.join(roomid);
  });
  socket.on("send-msg", async (data, roomid) => {
    const room = await roomsdb.findById(roomid);
    const msgid = room.messages[room.messages.length - 1]._id;
    socket.to(roomid).emit("recieve-msg", { ...data, _id: msgid.toString() });
  });
  socket.on("delete-msg", (msgid, roomid) => {
    socket.to(roomid).emit("on-delete", msgid);
  });
  socket.on("clear", (roomid) => {
    socket.to(roomid).emit("on-clear");
  });
  socket.on("removed", (name, roomid) => {
    socket.to(roomid).emit("on-removed", name, roomid);
  });
  socket.on("self-removed", (name, roomid) => {
    socket.to(roomid).emit("on-self-removed", name, roomid);
  });
});

io.on("connect_errot", (err) => {
  console.log("socket error", err.req);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
