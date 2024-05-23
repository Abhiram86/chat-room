import axios from "axios";

export type userdatatype = {
  username?: string;
  email?: string;
  password: string;
};

export const register = async (userdata: userdatatype) => {
  try {
    // console.log(userdata);
    const res = await axios.post(
      "http://localhost:3001/auth/register",
      userdata
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (userdata: userdatatype) => {
  try {
    const res = await axios.post(
      "http://localhost:3001/auth/sign-in",
      userdata
    );
    const user = {
      username: res.data.username,
      email: res.data.email,
      roomids: res.data.rooms,
    };
    localStorage.setItem("user", JSON.stringify(user));
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};
