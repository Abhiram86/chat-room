import { useState, useEffect, useContext } from "react";
import arrow from "../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";

export const Home = () => {
  const heading = "Make a Room Right now and chat with your friends!";
  const words = heading.split("");

  const [title, setTitle] = useState("");
  const { user } = useContext(ThemeContext);

  const router = useNavigate();

  useEffect(() => {
    const typing = () => {
      if (title.length < heading.length) {
        setTimeout(() => {
          setTitle((prevTitle) => prevTitle + words[title.length]);
        }, 75);
      }
    };
    typing();
  }, [title.length]);

  return (
    <section className="home main">
      <h1>CHAT ROOM</h1>
      <div className="home-title">
        {title}
        <img
          className="arrow"
          src={arrow}
          alt="make a new"
          onClick={() => router("/new")}
        />
      </div>
      <p>
        This is a simple chat application created using React, Node or Express
        which has very simple features, to create an{" "}
        {user === null ? (
          <>account click sign up and if have an account! click sign in</>
        ) : (
          <>room click create room button below</>
        )}
      </p>
      <div className="buttons">
        {user === null ? (
          <>
            <button className="light" onClick={() => router("/sign-up")}>
              sign up
            </button>
            <button onClick={() => router("/register")}>sign in</button>
          </>
        ) : (
          <div className="button-wrapper">
            <button className="createRoom" onClick={() => router("/new")}>
              create a new room
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
