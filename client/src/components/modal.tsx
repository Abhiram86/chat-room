import deleteMsg from "../assets/delete.svg";

type modalType = {
  handleCopy: () => void;
  handleRemoveUser: () => void;
  handleDeleteMsg: () => void;
};

export const Modal = ({
  handleCopy,
  handleRemoveUser,
  handleDeleteMsg,
}: modalType) => {
  return (
    <div className="modal">
      <div
        className="copy-msg"
        style={{
          cursor: "pointer",
        }}
        onClick={handleCopy}
      >
        <p>copy</p>
      </div>
      <hr />
      <div
        className="remove-user"
        style={{
          cursor: "pointer",
        }}
        onClick={handleRemoveUser}
      >
        <p>remove user</p>
      </div>
      <hr className="light-hr" />
      <div className="delete" onClick={handleDeleteMsg}>
        <p>delete</p>
        <img src={deleteMsg} alt="delete" />
      </div>
    </div>
  );
};
