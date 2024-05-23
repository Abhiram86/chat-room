import { Form } from "../components/form";
import { useEffect, useState } from "react";
import { register } from "../api/auth";
import { Toast } from "../components/toast";

export const Register = () => {
  const [userdata, setuserdata] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [toast, settoast] = useState({
    type: "",
    message: "",
  });

  const handle_username = (value: string) => {
    setuserdata({ ...userdata, username: value });
  };
  const handle_email = (value: string) => {
    setuserdata({ ...userdata, email: value });
  };
  const handle_password = (value: string) => {
    setuserdata({ ...userdata, password: value });
  };
  const handle_submit = async () => {
    const data = await register(userdata);
    if (data)
      if (data.error === "exists")
        return settoast({ type: "error", message: "exists" });
      else return settoast({ type: "success", message: "success" });
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
          <h1>Sign-up</h1>
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
            name="username"
            emailReq={true}
            descReq={false}
            email="email"
            password="password"
            onUserNameChange={handle_username}
            onEmailChange={handle_email}
            onPasswordChange={handle_password}
            onSubmit={handle_submit}
          />
        </div>
        <div className="link">
          <p>have an account ? </p>
          <a href="/register">sign-in</a>
        </div>
      </section>
      {toast.type !== "" && <Toast type={toast.type} message={toast.message} />}
    </>
  );
};
