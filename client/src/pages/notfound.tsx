import { useLocation } from "react-router-dom";

export const Notfound = () => {
  const location = useLocation();
  const route = location.pathname.split("/")[1];

  return (
    <section className="notfound main">
      <div className="page-title">
        <h1>404 not found</h1>
        <hr />
      </div>
      <div className="details">
        <h1>The /{route}/ route or page does not exist</h1>
      </div>
    </section>
  );
};
