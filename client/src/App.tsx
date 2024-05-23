import React, { createContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/home";
import { New } from "./pages/new";
import { Room } from "./pages/room";
import { Rooms } from "./pages/rooms";
import { Register } from "./pages/register";
import { SignIn } from "./pages/sign-in";
import { Logout } from "./pages/logout";
import { Nav } from "./components/nav.tsx";
import { Notfound } from "./pages/notfound.tsx";
// import { Footer } from "./components/footer.tsx";

export type User = null | {
  username: string;
  email: string;
  roomids: string[];
};

export type ThemeContextType = {
  user: User;
  setuser: React.Dispatch<React.SetStateAction<User>>;
  removedUsers: string[];
  setRemovedUsers: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ThemeContext = createContext<ThemeContextType>({
  user: null,
  setuser: () => {},
  removedUsers: [],
  setRemovedUsers: () => {},
});

function App() {
  const [user, setuser] = useState<User>(null);
  const [removedUsers, setRemovedUsers] = useState<string[]>([]);

  useEffect(() => {
    const userdata = localStorage.getItem("user");
    if (userdata) {
      const data = JSON.parse(userdata) as User;
      setuser(data);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ user, setuser, removedUsers, setRemovedUsers }}
    >
      <div className="navbar">
        <Nav />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/register" element={<SignIn />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </ThemeContext.Provider>
  );
}

export default App;
