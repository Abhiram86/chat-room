import express from "express";
import roomsdb from "../models/rooms.js";
import usersdb from "../models/users.js";

const room = express.Router();

room.use(express.json());

room.get("/", async (req, res) => {
  const data = await roomsdb.find({});
  res.json(data);
});

room.post("/new", async (req, res) => {
  const { username, roomname, passkey, description } = req.body;
  const room = await roomsdb.findOne({ roomname });
  const user = await usersdb.findOne({ username });
  if (!user) return res.json({ msg: "404" });
  if (room) return res.json({ msg: "exists" });
  try {
    const newroom = new roomsdb({
      roomname,
      passkey,
      description,
      createdBy: user._id,
      members: [user._id],
      messages: [],
    });
    await newroom.save();
    user.rooms.push(newroom._id);
    await user.save();
    res.json(newroom._id);
  } catch (error) {
    res.json(error);
  }
});

room.post("/join", async (req, res) => {
  const { username, roomname, passkey } = req.body;
  const user = await usersdb.findOne({ username });
  const room = await roomsdb.findOne({ roomname });
  if (!user) return res.json({ error: "404" });
  if (!room) return res.json({ error: "404" });
  if (room.createdBy.toString() === user._id.toString())
    return res.json({ error: "creator" });
  if (room.members.includes(user._id)) return res.json({ error: "exists" });
  if (room.passkey === passkey) {
    user.rooms.push(room._id);
    await user.save();
    room.members.push(user._id);
    await room.save();
    res.json(room._id);
  } else {
    res.json({ error: "mismatch" });
  }
});

room.post("/message", async (req, res) => {
  const { username, content, roomid } = req.body;
  const user = await usersdb.findOne({ username });
  const room = await roomsdb.findById(roomid);
  if (!user) return res.json({ error: "404" });
  if (!room) return res.json({ error: "404" });
  const message = {
    username,
    content,
  };
  room.messages.push(message);
  await room.save();
  res.json({ ...message, _id: room.messages[room.messages.length - 1]._id });
});

room.post("/:roomid", async (req, res) => {
  const roomid = req.params.roomid;
  const { username } = req.body;
  const user = await usersdb.findOne({ username });
  const room = await roomsdb.findById(roomid);
  if (!user) return res.json({ error: "404" });
  if (!room) return res.json({ error: "404" });
  if (!room.members.includes(user._id))
    return res.json({ error: "not exists" });
  res.json(room);
});

room.patch("/remove-member", async (req, res) => {
  const { roomid, username, userToBeRemoved } = req.body;
  const room = await roomsdb.findById(roomid);
  const user = await usersdb.findOne({ username });
  const user2 = await usersdb.findOne({ username: userToBeRemoved });
  if (!room) return res.json({ error: "404" });
  if (!user) return res.json({ error: "404" });
  if (!user2) return res.json({ error: "User2 doesnt exist" });
  if (!(room.createdBy.toString() === user._id.toString()))
    return res.json({ error: "unathorized" });
  if (!room.members.includes(user2._id))
    return res.json({ error: "not a member" });
  room.members.remove(user2._id);
  user2.rooms.remove(room._id);
  await user2.save();
  await room.save();
  res.json({ msg: "succesfull" });
});

room.patch("/message/remove", async (req, res) => {
  const { roomid, msgid } = req.body;
  const room = await roomsdb.findById(roomid);
  if (!room) return res.json({ error: "404" });
  const message = room.messages.find(
    (message) => message._id.toString() === msgid
  );
  if (!message) return res.json({ error: "not exists" });
  room.messages.remove(message);
  await room.save();
  // res.json(message._id.toString());
});

export default room;
