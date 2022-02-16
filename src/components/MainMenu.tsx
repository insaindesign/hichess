import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

import VerifyAdult from "./VerifyAdult";

import css from "./MainMenu.module.css";

type Props = {
  onClick?: () => void;
};

function MainMenu({ onClick }: Props) {
  const { t } = useTranslation();
  const [amAnAdult, setImAnAdult] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const verifyAdult = useCallback(() => {
    if (amAnAdult) {
      setImAnAdult(false);
    } else {
      setShowVerify(true);
    }
  }, [amAnAdult]);

  const handleVerify = useCallback((success: boolean) => {
    setShowVerify(false);
    setImAnAdult(success);
  }, []);

  return (
    <div className={css.root}>
      <Grid container spacing={2} className={css.grid}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/learn"
            className={css.link}
            onClick={onClick}
          >
            {t("mainmenu.learn")}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/puzzles"
            className={css.link}
            onClick={onClick}
          >
            {t("mainmenu.puzzles")}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/play"
            className={css.link}
            onClick={onClick}
          >
            {t("mainmenu.play")}
          </Button>
        </Grid>
        {amAnAdult ? (
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              className={css.link}
              onClick={verifyAdult}
            >
              {t("mainmenu.hideGrownups")}
            </Button>
          </Grid>
        ) : null}
        {amAnAdult ? (
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/about"
              className={css.link}
            >
              {t("mainmenu.about")}
            </Button>
          </Grid>
        ) : null}
        {amAnAdult ? (
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/privacy"
              className={css.link}
            >
              {t("mainmenu.privacy")}
            </Button>
          </Grid>
        ) : null}
        {amAnAdult ? (
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              className={css.link}
              href="https://www.buymeacoffee.com/hichess"
            >
              {t("mainmenu.donate")}
            </Button>
          </Grid>
        ) : null}
      </Grid>
      {showVerify ? (
        <VerifyAdult onChange={handleVerify} />
      ) : !amAnAdult ? (
        <Button fullWidth onClick={verifyAdult}>
          {t("mainmenu.grownups")}
        </Button>
      ) : null}
    </div>
  );
}

export default MainMenu;
