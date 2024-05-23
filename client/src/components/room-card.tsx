import { useNavigate } from "react-router-dom";
import { getOut } from "../api/room";
import { ThemeContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { socket } from "../pages/room";
import { Toast } from "./toast";

type RoomCardProps = {
  name: string;
  description: string;
  // descriptionReq: boolean;
  id: string;
};

export const RoomCard = ({
  name,
  description,
  id,
}: // descriptionReq,
RoomCardProps) => {
  const router = useNavigate();
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });
  const { user, setuser } = useContext(ThemeContext);

  const handleGetOut = async () => {
    if (window.confirm("Are you sure you want to get out?")) {
      if (user) {
        const res = await getOut(user?.username, id);
        if (res && res.msg === "succesfull") {
          const userdata = localStorage.getItem("user");
          if (userdata) {
            const data = JSON.parse(userdata);
            data.roomids = data.roomids.filter(
              (roomid: string) => roomid !== id
            );
            localStorage.setItem("user", JSON.stringify(data));
            setuser({ ...user, roomids: data.roomids });
            settoast({ type: "success", message: "removed" });
            socket.emit("self-removed", user?.username, id);
          }
        } else {
          settoast({ type: "error", message: "u created this" });
        }
      }
    }
  };

  useEffect(() => {
    if (toast.type !== "") {
      const timeoutId = setTimeout(() => {
        settoast({ type: "", message: "" });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [toast.type]);

  return (
    <>
      <section className="room-card">
        <div className="title">
          <h1>{name}</h1>
          <hr />
        </div>
        <div className="desc">
          {description.length > 0 ? (
            <p>{description}</p>
          ) : (
            <p>No description provided</p>
          )}
        </div>
        <div className="buttons">
          <button type="button" onClick={() => router(`/room/${id}`)}>
            Enter Room
          </button>
          <button type="button" className="destructive" onClick={handleGetOut}>
            get out
          </button>
        </div>
      </section>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
