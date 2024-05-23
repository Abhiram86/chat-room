import indication from "../assets/indication.svg";

export const Userslist = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="usersListWrapper">
      <img src={indication} alt="arrow" />
      <div className="usersList">{children}</div>
    </div>
  );
};
