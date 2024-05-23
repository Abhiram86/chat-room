import info from "../assets/info.svg";
import success from "../assets/success.svg";
import error from "../assets/error.svg";

export const Toast = ({ type, message }: { type: string; message: string }) => {
  return (
    <div
      className="toast-wrapper"
      style={{
        backgroundImage:
          type === "error"
            ? "var(--error-bg)"
            : "success"
            ? "var(--success-bg)"
            : "var(--warning-bg)",
        border:
          type === "error"
            ? "2px solid var(--error-border)"
            : "success"
            ? "2px solid var(--success-border)"
            : "2px solid var(--warning-border)",
      }}
    >
      <div className="img">
        <img
          src={type === "error" ? error : "success" ? success : info}
          alt="type of errror"
        />
      </div>
      <div className="content">
        <p>{message}</p>
      </div>
    </div>
  );
};
