import { Form } from "../components/form";
import { RoomCard } from "../components/room-card";
import { ThemeContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { join, getRoomDetails } from "../api/room";
import { Loader } from "../components/loader";
import { Toast } from "../components/toast";

export type roomlisttype = {
  roomname: string;
  desc: string;
  id: string;
};

export const Rooms = () => {
  const { user, setuser } = useContext(ThemeContext);
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });
  const router = useNavigate();
  const [roomdata, setroomdata] = useState({
    username: user?.username || "",
    roomname: "",
    passkey: "",
  });
  const [isloading, setisloading] = useState(true);
  const [roomslist, setroomslist] = useState<roomlisttype[] | null>(null);

  const handleRoomName = (value: string) => {
    setroomdata({ ...roomdata, roomname: value });
  };

  const handlePassKey = (value: string) => {
    setroomdata({ ...roomdata, passkey: value });
  };

  const onSubmit = async () => {
    if (user !== null && roomdata.username !== "") {
      await join(roomdata.roomname, roomdata.username, roomdata.passkey).then(
        (res) => {
          console.log(res);
          if (res.error === "404")
            return settoast({ type: "error", message: "not found" });
          if (res.error === "mismatch")
            return settoast({ type: "error", message: "invalid input" });
          if (res.error === "exists")
            return settoast({ type: "error", message: "already exists" });
          if (res.error === "creator")
            return settoast({ type: "error", message: "u created this" });
          setuser({ ...user, roomids: [...user.roomids, res.toString()] });
          const data = localStorage.getItem("user");
          let userdata = data ? JSON.parse(data) : null;
          if (userdata) {
            userdata.roomids = [...userdata.roomids, res.toString()];
            localStorage.setItem("user", JSON.stringify(userdata));
          }
          router(`../room/${res.toString()}`);
        }
      );
    }
  };

  useEffect(() => {
    if (user?.roomids)
      getRoomDetails(user.roomids).then((res) => {
        setTimeout(() => {
          setroomslist(res);
          setisloading(false);
        }, 1000);
      });
  }, [user]);

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
      <section className="rooms main">
        {user === null ? (
          <div className="auth-error">
            <h1>Please Login</h1>
            <button type="button" onClick={() => router("/register")}>
              sign-in
            </button>
          </div>
        ) : (
          <>
            <aside>
              <div className="page-title">
                <h1
                  style={{
                    fontSize: "1.25rem",
                  }}
                >
                  Enter a Room with name
                </h1>
                <hr />
              </div>
              <Form
                name="Name of the Room"
                password="password"
                descReq={false}
                emailReq={false}
                onUserNameChange={handleRoomName}
                onPasswordChange={handlePassKey}
                onSubmit={onSubmit}
              />
            </aside>
            <div className="room-list-wrapper">
              <div className="page-title">
                <h1
                  style={{
                    color: "#828282",
                    backgroundColor: "transparent",
                  }}
                >
                  Previously visited rooms
                </h1>
                <hr />
              </div>
              {isloading ? (
                <Loader />
              ) : (
                <div className="rooms-list">
                  {roomslist !== null ? (
                    roomslist.map((room, index) => (
                      <RoomCard
                        key={index}
                        name={room.roomname}
                        description={room.desc || ""}
                        id={room.id}
                      />
                    ))
                  ) : (
                    <h1
                      style={{
                        marginInline: "auto",
                        backgroundColor: "transparent",
                      }}
                    >
                      No rooms found
                    </h1>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </section>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
