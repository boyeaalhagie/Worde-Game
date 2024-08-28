import { useNavigate } from "react-router-dom";
import React from "react";
import {render} from "react-dom";
import {parseUserJson, User} from "../request/User";

/**
 * Renders the menu component for choosing a page.
 * @returns {JSX.Element} The rendered menu component.
 */
export function ChoosePage(): React.ReactElement {
  const navigate = useNavigate();

  let user: User|null = null
  let userRaw = localStorage.getItem("user");
  if (userRaw) {
    user = parseUserJson(userRaw);
  }

  let gameButton = <></>
    if(user) {
        gameButton = <button
            onClick={() => {
                navigate("/game");
            }}
        >
            Game
        </button>
    }

    let adminButtons = <></>
    if (user && user.getPrivileges() > 0) {
        adminButtons = <>
            <button
                onClick={() => {
                    navigate("/admin");
          }}
      >
        Admin
      </button>
      <button
          onClick={() => {
            navigate("/tester");
          }}
      >
        Tester
      </button>

    {/*stat button*/
    }
    <button
        className="stat-btn"
        onClick={() => {
          navigate("/stat");
        }}
    >
      <img
          className={"modal-img"}
          src={require("../resources/stat.png")}
          alt=""
      />
    </button>
    </>
  }

  return (
      <>
        <header>
          Wordle
          <span> </span>
          {/* move to pages using react router dom */}
          <button
              onClick={() => {
                navigate("/");
              }}
          >
            Login
          </button>
            {gameButton}
          {adminButtons}
        </header>
      </>
  );
}
