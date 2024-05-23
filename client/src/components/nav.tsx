import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useContext } from "react";

export const Nav = () => {
  const location = useLocation();
  const router = useNavigate();
  const path = location.pathname;
  const { user } = useContext(ThemeContext);

  return (
    <header>
      <ul>
        <li
          style={
            path === "/"
              ? {
                  backgroundColor: "rgb(244, 244, 244)",
                  color: "rgb(18, 18, 18)",
                }
              : {
                  backgroundColor: "rgb(18, 18, 18)",
                  color: "rgb(244, 244, 244)",
                }
          }
          onClick={() => router("/")}
        >
          <div
            style={
              path === "/"
                ? {
                    backgroundColor: "rgb(244, 244, 244)",
                    color: "rgb(18, 18, 18)",
                  }
                : {
                    backgroundColor: "rgb(18, 18, 18)",
                    color: "rgb(244, 244, 244)",
                  }
            }
          >
            Home
          </div>
        </li>
        <li
          style={
            path === "/new"
              ? {
                  backgroundColor: "rgb(244, 244, 244)",
                  color: "rgb(18, 18, 18)",
                }
              : {
                  backgroundColor: "rgb(18, 18, 18)",
                  color: "rgb(244, 244, 244)",
                }
          }
          onClick={() => router("/new")}
        >
          <div
            style={
              path === "/new"
                ? {
                    backgroundColor: "rgb(244, 244, 244)",
                    color: "rgb(18, 18, 18)",
                  }
                : {
                    backgroundColor: "rgb(18, 18, 18)",
                    color: "rgb(244, 244, 244)",
                  }
            }
          >
            New
          </div>
        </li>
        <li
          style={
            path === "/rooms"
              ? {
                  backgroundColor: "rgb(244, 244, 244)",
                  color: "rgb(18, 18, 18)",
                }
              : {
                  backgroundColor: "rgb(18, 18, 18)",
                  color: "rgb(244, 244, 244)",
                }
          }
          onClick={() => router("/rooms")}
        >
          <div
            style={
              path === "/rooms"
                ? {
                    backgroundColor: "rgb(244, 244, 244)",
                    color: "rgb(18, 18, 18)",
                  }
                : {
                    backgroundColor: "rgb(18, 18, 18)",
                    color: "rgb(244, 244, 244)",
                  }
            }
          >
            Rooms
          </div>
        </li>
        {user === null ? (
          <li
            style={
              path === "/register"
                ? {
                    backgroundColor: "rgb(244, 244, 244)",
                    color: "rgb(18, 18, 18)",
                  }
                : {
                    backgroundColor: "rgb(18, 18, 18)",
                    color: "rgb(244, 244, 244)",
                  }
            }
            onClick={() => router("/register")}
          >
            <div
              style={
                path === "/register"
                  ? {
                      backgroundColor: "rgb(244, 244, 244)",
                      color: "rgb(18, 18, 18)",
                    }
                  : {
                      backgroundColor: "rgb(18, 18, 18)",
                      color: "rgb(244, 244, 244)",
                    }
              }
            >
              Register
            </div>
          </li>
        ) : (
          <li
            style={
              path === "/logout"
                ? {
                    backgroundColor: "rgb(244, 244, 244)",
                    color: "rgb(18, 18, 18)",
                  }
                : {
                    backgroundColor: "rgb(18, 18, 18)",
                    color: "rgb(244, 244, 244)",
                  }
            }
            onClick={() => router("/logout")}
          >
            <div
              style={
                path === "/logout"
                  ? {
                      backgroundColor: "rgb(244, 244, 244)",
                      color: "rgb(18, 18, 18)",
                    }
                  : {
                      backgroundColor: "rgb(18, 18, 18)",
                      color: "rgb(244, 244, 244)",
                    }
              }
            >
              Logout
            </div>
          </li>
        )}
      </ul>
    </header>
  );
};
