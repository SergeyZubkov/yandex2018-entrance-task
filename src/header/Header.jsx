import logo from "../logo.svg";
import Button from "../button/Button";
import "./Header.css";

import { Link, useLocation } from "react-router-dom";
import { pickedDateStartVar } from "..";
import { useReactiveVar } from "@apollo/client";

import isPastDate from "../utils/isPastDay";

function Header() {
  const pickedDateStart = useReactiveVar(pickedDateStartVar);

  const showBtnPaths = ['/']

  const currentPath = useLocation().pathname

  const renderButton = () => {
    if (showBtnPaths.includes(currentPath)) {
      return (
        <Button disabled={isPastDate(pickedDateStart)}>
          Создать встречу
        </Button> 
      )
    } else {
      return null
    }
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <Link to="/event/add">
          {renderButton()}
        </Link>
      </div>
    </header>
  );
}

export default Header;
