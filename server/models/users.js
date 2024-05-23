import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxLength: 25,
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "rooms" }],
  createdAt: { type: Date, default: Date.now },
});

const usersdb = mongoose.model("users", userSchema);

export default usersdb;
