import { useState, useContext, useEffect } from "react";
import dots from "../assets/dots.svg";
import { Modal } from "../components/modal";
import { deleteMessage, removeMember } from "../api/room";
import { messagetype } from "../pages/room";
import { socket } from "../pages/room";
import { ThemeContext } from "../App";
import { Toast } from "./toast";

type meassageProps = {
  name: string;
  content: string;
  msgId: string;
  roomId: string;
  reloadState: React.Dispatch<React.SetStateAction<messagetype[] | null>>;
};

export const Message = ({
  name,
  content,
  msgId,
  roomId,
  reloadState,
}: meassageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(ThemeContext);
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });

  const handleMore = () => {
    setIsOpen((prev) => !prev);
  };

  // const [sender, setSender] = useState(false);

  const handleRemoveUser = async () => {
    if (user)
      await removeMember(roomId, user?.username, name).then((res) => {
        if (res.error === "unathorized")
          return settoast({ type: "error", message: "unathorized" });
        if (user.username === name)
          return settoast({ type: "warning", message: "cant remove" });
        settoast({ type: "success", message: "removed" });
        socket.emit("removed", name, roomId);
      });
  };

  const handleDeleteMessage = async (roomid: string, msgid: string) => {
    try {
      await deleteMessage(roomid, msgid);
      reloadState((prev) => prev && prev.filter((msg) => msg._id !== msgid));
      socket.emit("delete-msg", msgid, roomid);
      // setSender(true);
    } catch (error) {
      console.error("Error deleting message:", error);
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
      <div
        className={`message ${user?.username === name ? "sender" : "reciever"}`}
      >
        <div className="sender-name">
          <p>{name}</p>
          <img
            src={dots}
            alt="more"
            className="dots"
            // onClick={handleMore}
            onMouseOver={handleMore}
            onMouseOut={handleMore}
          />
        </div>
        <div
          className="modal-wrapper"
          onMouseOver={() => setIsOpen(true)}
          onMouseOut={() => setIsOpen(false)}
        >
          {isOpen && (
            <Modal
              handleCopy={() => {
                navigator.clipboard.writeText(content);
                settoast({ type: "success", message: "copied" });
              }}
              handleRemoveUser={handleRemoveUser}
              handleDeleteMsg={() => handleDeleteMessage(roomId, msgId)}
            />
          )}
        </div>
        <div className="content">
          <p>{content}</p>
        </div>
      </div>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
