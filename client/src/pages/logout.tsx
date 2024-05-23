import { useContext } from "react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

export const Logout = () => {
  const router = useNavigate();
  const { setuser } = useContext(ThemeContext);

  logout();
  setuser(null);
  router("/");
  return null;
};
