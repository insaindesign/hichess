import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import UserPicker from "../components/AccountPicker";

import css from "./Home.module.css";

function Home() {
  const { t } = useTranslation();
  return (
    <div className={css.root}>
      <img
        alt="HiChess"
        src="/icon-192.png"
        width={64}
        height={64}
        className={css.logo}
      />
      <UserPicker />
      <ButtonGroup variant="text">
        <Button component={Link} to="/about">
          {t("mainmenu.about")}
        </Button>
        <Button component={Link} to="/privacy">
          {t("mainmenu.privacy")}
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default Home;
