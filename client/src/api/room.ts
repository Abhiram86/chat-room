import axios from "axios";

type roomdatatype = {
  username: string;
  roomname: string;
  passkey: string;
  description: string;
};

export const createRoom = async (roomdata: roomdatatype) => {
  try {
    const res = await axios.post("http://localhost:3001/room/new", roomdata);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const loadRoom = async (roomid: string, username: string) => {
  try {
    const res = await axios.post(`http://localhost:3001/room/${roomid}`, {
      username,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const join = async (
  roomname: string,
  username: string,
  passkey: string
) => {
  const res = await axios.post("http://localhost:3001/room/join", {
    username,
    roomname,
    passkey,
  });
  return res.data;
};

export const sendMessage = async (
  username: string,
  content: string,
  roomid: string
) => {
  try {
    const res = await axios.post(`http://localhost:3001/room/message`, {
      username,
      content,
      roomid,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomDetails = async (roomids: string[]) => {
  const res = await axios.post("http://localhost:3001/roomdetails", {
    roomids,
  });
  return res.data;
};

export const deleteMessage = async (roomid: string, msgid: string) => {
  const res = await axios.patch("http://localhost:3001/room//message/remove", {
    roomid,
    msgid,
  });
  return res.data;
};

export const clear = async (roomid: string, username: string) => {
  const res = await axios.patch("http://localhost:3001/clear", {
    roomid,
    username,
  });
  return res.data;
};

export const removeMember = async (
  roomid: string,
  username: string,
  userToBeRemoved: string
) => {
  const res = await axios.patch("http://localhost:3001/room/remove-member", {
    roomid,
    username,
    userToBeRemoved,
  });
  return res.data;
};

export const getOut = async (username: string, roomid: string) => {
  const res = await axios.patch("http://localhost:3001/self-remove", {
    username,
    roomid,
  });
  return res.data;
};

export const getUsers = async (roomid: string) => {
  const res = await axios.post("http://localhost:3001/get-users", {
    roomid,
  });
  return res.data;
};
