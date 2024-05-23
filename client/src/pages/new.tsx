import { Form } from "../components/form";
import { ThemeContext } from "../App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api/room";

export const New = () => {
  const { user } = useContext(ThemeContext);
  const router = useNavigate();

  type userdatatype = {
    username: string;
    roomname: string;
    passkey: string;
    description: string;
  };

  const [userdata, setuserdata] = useState<userdatatype>({
    username: user?.username || "",
    roomname: "",
    passkey: "",
    description: "",
  });

  const handleRoomName = (value: string) => {
    setuserdata({ ...userdata, roomname: value });
  };

  const handlePassKey = (value: string) => {
    setuserdata({ ...userdata, passkey: value });
  };

  const handleDesc = (value: string) => {
    setuserdata({ ...userdata, description: value });
  };

  const handleSubmit = async () => {
    if (user?.username) {
      await createRoom({ ...userdata, username: user.username })
        .then((id) => (console.log(id), router(`../room/${id}`)))
        .catch((err) => console.log(err));
    } else {
      console.error("User not found");
    }
  };

  return (
    <section className="new-page main">
      {user === null ? (
        <div className="auth-error">
          <h1>Please Login</h1>
          <button type="button" onClick={() => router("/register")}>
            sign-in
          </button>
        </div>
      ) : (
        <>
          <div className="page-title">
            <h1>Make a Room and invite your friends</h1>
            <hr />
          </div>
          <Form
            name="Name of the Room(unique)"
            password="PassKey"
            descReq={true}
            emailReq={false}
            onUserNameChange={handleRoomName}
            onPasswordChange={handlePassKey}
            onDescriptionChange={handleDesc}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </section>
  );
};
