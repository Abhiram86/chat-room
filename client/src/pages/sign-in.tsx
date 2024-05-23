import { Form } from "../components/form";
import { ThemeContext, ThemeContextType } from "../App";
import { useContext, useEffect, useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Toast } from "../components/toast";

type userdatatype = {
  identifier: string;
  password: string;
};

export const SignIn = () => {
  const { setuser } = useContext<ThemeContextType>(ThemeContext);
  const router = useNavigate();

  const [userdata, setuserdata] = useState<userdatatype>({
    identifier: "",
    password: "",
  });
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });

  const handle_identifier = (value: string) => {
    setuserdata({ ...userdata, identifier: value });
  };

  const handle_password = (value: string) => {
    setuserdata({ ...userdata, password: value });
  };

  const handle_submit = async () => {
    try {
      const data = await login(userdata);
      if (data) {
        if (data.error === "404")
          return settoast({ type: "error", message: "not found" });
        if (data.error === "mismatch")
          return settoast({ type: "error", message: "missmatch" });
        const name: string = data.username;
        const email: string = data.email;
        const roomids: string[] = data.rooms;
        setuser({
          username: name,
          email: email,
          roomids: roomids,
        });
        router("/");
      } else {
        console.error("User data not available");
      }
    } catch (error) {
      console.error("Error logging in:", error);
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
      <section className="auth main">
        <div className="page-title">
          <h1>Sign-in</h1>
          <hr />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
        >
          <Form
            name="username or email"
            password="password"
            descReq={false}
            emailReq={false}
            emailplaceholder="ex: John Doe or John@gmail.com"
            onUserNameChange={handle_identifier}
            onPasswordChange={handle_password}
            onSubmit={handle_submit}
          />
        </div>
        <div className="link">
          <p>dont have an account ? </p>
          <a href="/sign-up">sign-up</a>
        </div>
      </section>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
