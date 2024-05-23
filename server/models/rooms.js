import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  passkey: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
  },
  description: {
    type: String,
    maxLength: 50,
  },
  messages: [
    {
      username: String,
      content: {
        type: String,
        maxLength: 500,
      },
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const roomsdb = mongoose.model("rooms", roomSchema);

export default roomsdb;
