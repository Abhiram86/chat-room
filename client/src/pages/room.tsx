import { Message } from "../components/message";
import send from "../assets/send.svg";
import copy from "../assets/copy.svg";
import { ThemeContext } from "../App";
import { useState, useRef, useContext, useEffect } from "react";
import { clear, getUsers, loadRoom, sendMessage } from "../api/room";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Loader } from "../components/loader";
import { Toast } from "../components/toast";
import { Userslist } from "../components/Userslist";

export type messagetype = {
  username: string;
  content: string;
  _id: string;
};

const SOCKER_URL = "http://localhost:3001";

export const socket = io(SOCKER_URL);

export const Room = () => {
  const msg = useRef<HTMLTextAreaElement>(null);
  const [name, setname] = useState("");
  const [isloading, setisloading] = useState(true);
  const location = useLocation();
  const roomid = location.pathname.split("/")[2];
  console.log(roomid);
  const [msgs, setmsgs] = useState<messagetype[] | null>(null);
  const { user, setuser } = useContext(ThemeContext);
  const [roompassword, setroompassword] = useState("");
  const [sender, setSender] = useState(false);
  const [userlistmodal, setuserlistmodal] = useState(false);
  const [usernames, setusernames] = useState<string[]>([]);
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });
  const router = useNavigate();

  socket.on("connect", () => {
    console.log("connected");
  });

  const clearRoom = async () => {
    if (user) {
      await clear(roomid, user.username).then((data) => {
        if (data.error === "unathorized")
          return settoast({ type: "error", message: "unathorized" });
        setmsgs(data as messagetype[] | null);
        settoast({ type: "success", message: "cleared" });
        socket.emit("clear", roomid);
      });
    }
  };

  const sendmsg = async () => {
    if (msg.current) {
      if (user) {
        const data = await sendMessage(
          user?.username,
          msg.current.value,
          roomid
        );
        setmsgs((prev) => prev && [...prev, data]);
      }
    }
    if (msg.current && user?.username) {
      const sentmsg = {
        username: user?.username,
        content: msg.current.value,
      };
      socket.emit("send-msg", sentmsg, roomid);
      setSender(true);
      msg.current.value = "";
    }
  };

  useEffect(() => {
    socket.emit("join-room", roomid);
  });

  // useEffect(() => {
  //   socket.on("removed", () => {
  //     if (user) if (removedUsers.includes(user.username)) router("/");
  //     toast.info(`${removedUsers[removedUsers.length - 1]} removed`, {
  //       position: "top-left",
  //       theme: "dark",
  //       autoClose: 2000,
  //     });
  //   });
  // }, [socket]);

  useEffect(() => {
    const handleOnDelete = (name: string, roomid: string) => {
      if (name === user?.username) {
        const data = localStorage.getItem("user");
        if (data) {
          try {
            const userdata = JSON.parse(data);
            userdata.roomids = userdata.roomids.filter(
              (id: string) => id !== roomid
            );
            localStorage.setItem("user", JSON.stringify(userdata));
            router("/");
          } catch (error) {
            console.error("Error updating local storage:", error);
          }
        }
      }
    };

    socket.on("on-delete", handleOnDelete);

    return () => {
      socket.off("on-delete", handleOnDelete);
    };
  }, [socket, user]);

  useEffect(() => {
    socket.on("on-clear", () => {
      setmsgs(null);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("on-removed", (name: string, id: string) => {
      console.log(name, user?.username, id);
      if (user?.username === name) {
        console.log("yes");
        const userdata = localStorage.getItem("user");
        if (userdata) {
          const data = JSON.parse(userdata);
          data.roomids = data.roomids.filter((roomid: string) => roomid !== id);
          setuser({ ...user, roomids: data.roomids });
          localStorage.setItem("user", JSON.stringify(data));
          router("/rooms");
        }
      } else {
        return settoast({ type: "warning", message: `${name} removed` });
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("recieve-msg", (data: any) => {
      // console.log("hdbc0", data);
      if (sender) setSender(false);
      else setmsgs((prev) => prev && [...prev, data]);
    });

    return () => {
      socket.off("recieve-msg");
    };
  }, [socket]);

  useEffect(() => {
    const handleLoadRoom = async () => {
      if (user) {
        const room = await loadRoom(roomid, user.username);
        if (room.error !== "not exists") {
          setmsgs(room.messages || null);
          setname(room.roomname);
          setroompassword(room.passkey);
          setisloading(false);
          console.log(room);
        } else {
          settoast({ type: "error", message: "join to chat" });
        }
      }
    };
    handleLoadRoom();
  }, [user?.username]);

  useEffect(() => {
    socket.on("on-delete", (id: String) => {
      setmsgs((prev) => prev && prev.filter((msg) => msg._id !== id));
    });
  }, [socket]);

  useEffect(() => {
    const handleEvent = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (msg.current) sendmsg();
      }
    };
    document.addEventListener("keydown", handleEvent);
    return () => {
      document.removeEventListener("keydown", handleEvent);
    };
  });

  useEffect(() => {
    if (toast.type !== "") {
      const timeoutId = setTimeout(() => {
        settoast({ type: "", message: "" });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [toast.type]);

  useEffect(() => {
    const handleUserList = async () => {
      const usernames = await getUsers(roomid);
      if (usernames) setusernames(usernames);
    };
    handleUserList();
  }, [user?.username]);

  return (
    <>
      <section className="room main">
        <div className="page-title">
          <h1>Room</h1>
          <hr />
        </div>
        <div className="details">
          <div className="copy">
            <p>copy room password</p>
            <img
              src={copy}
              alt="copy"
              onClick={() => navigator.clipboard.writeText(roompassword)}
            />
          </div>
          <div
            className="options"
            onClick={() => setuserlistmodal((prev) => !prev)}
          >
            <div className="users detail">
              <p>users</p>
            </div>
            {userlistmodal && (
              <Userslist>
                {usernames.map((name, index) => (
                  <p key={index}>{name}</p>
                ))}
              </Userslist>
            )}
            <div className="clear detail" onClick={clearRoom}>
              <p>clear</p>
            </div>
          </div>
        </div>
        {isloading ? (
          <div className="load-wrapper">
            <Loader />
          </div>
        ) : (
          <div className="chat-room">
            <div className="title">Name: {name && name}</div>
            <hr />
            <div className="message-wrapper">
              {msgs !== null &&
                user &&
                msgs.map((msg, index) => (
                  <div
                    className="message-box"
                    key={index}
                    style={
                      msg.username === user?.username
                        ? { position: "relative", left: "26vw" }
                        : {}
                    }
                  >
                    <Message
                      name={msg.username}
                      content={msg.content}
                      msgId={msg._id}
                      roomId={roomid}
                      reloadState={setmsgs}
                    />
                  </div>
                ))}
            </div>
            <div className="typing-box">
              <textarea ref={msg} placeholder="message..."></textarea>
              <img src={send} alt="send" onClick={sendmsg} />
            </div>
          </div>
        )}
        <style>
          {`
          .message-box {
            width: 100%;
            height: auto;
            word-break: break-word;
            overflow-wrap: break-word;
          }
        `}
        </style>
        <style>
          {`
          @media (max-width: 460px) {
            .typing-box {
              gap: 1rem;
            }
          }
        `}
        </style>
      </section>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
