import { userdatatype } from "../api/auth";

type FormProps = {
  name: string;
  password: string;
  descReq: Boolean;
  email?: string;
  emailReq: Boolean;
  emailplaceholder?: string;
  onUserNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onSubmit: () => void;
};

export const Form = ({
  name,
  password,
  descReq,
  email,
  emailReq,
  emailplaceholder,
  onUserNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onDescriptionChange,
}: FormProps) => {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onSubmit();
    return;
  };
  return (
    <form className="new-form" action="#">
      <label htmlFor="name">{name}</label>
      <hr />
      <div className="field1 field">
        <p>minimum of 5 characters</p>
        <input
          type="text"
          id="name"
          required
          placeholder={
            emailReq || emailplaceholder !== undefined
              ? "ex: John Doe"
              : "ex: Room123"
          }
          minLength={5}
          onChange={(e) => onUserNameChange?.(e.target.value)}
          autoComplete="current-username"
        />
      </div>
      {emailReq && (
        <>
          <label htmlFor="email">{email}</label>
          <hr />
          <div className="field">
            <input
              type="email"
              id="email"
              required
              placeholder="ex: John@gmail.com"
              onChange={(e) => onEmailChange?.(e.target.value)}
            />
          </div>
        </>
      )}
      <label htmlFor="passkey">{password}</label>
      <hr />
      <div className="field2 field">
        <p>minimum of 8 characters</p>
        <input
          type={descReq || emailReq ? "text" : "password"}
          id="passkey"
          placeholder="password should be min of 8 characters"
          required
          minLength={8}
          onChange={(e) => onPasswordChange?.(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {descReq && (
        <>
          <label htmlFor="desc">Description</label>
          <hr />
          <textarea
            name="desc"
            id="desc"
            placeholder="ex: This is my room"
            onChange={(e) => onDescriptionChange?.(e.target.value)}
          ></textarea>
        </>
      )}
      <button type="submit" onClick={(e) => handleSubmit(e)}>
        {emailplaceholder
          ? "Sign in"
          : descReq
          ? "Create Room"
          : emailReq
          ? "Register"
          : "Join Room"}
      </button>
    </form>
  );
};

// Name of the Room(unique)
// PassKey
