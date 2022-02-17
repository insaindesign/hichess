import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Cancel from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";

import { selectedAccountState } from "../state/accounts";
import VerifyAdult from "./VerifyAdult";
import AccountAvatarAsync from "./AccountAvatarAsync";

import type { ButtonProps } from "@mui/material/Button";

import css from "./MainMenu.module.css";

type Props = {
  onClick?: () => void;
};

type MenuItem = ButtonProps<
  typeof Button,
  { component?: any; to?: string; key: string }
>;

function MainMenu({ onClick }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [amAnAdult, setImAnAdult] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [account, setAccount] = useRecoilState(selectedAccountState);

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

  const logout = useCallback(() => {
    setAccount(null);
    navigate("/");
  }, [setAccount, navigate]);

  const menuItems: MenuItem[] = [];
  if (account) {
    menuItems.push({
      children: t("mainmenu.learn"),
      component: Link,
      to: "/learn",
      onClick,
      key: "learn",
    });
    menuItems.push({
      component: Link,
      to: "/puzzles",
      onClick,
      children: t("mainmenu.puzzles"),
      key: "puzzles",
    });
    menuItems.push({
      component: Link,
      to: "/play",
      onClick,
      children: t("mainmenu.play"),
      key: "play",
    });
  }
  if (amAnAdult || !account) {
    menuItems.push({
      component: Link,
      key: "about",
      to: "/about",
      onClick,
      children: t("mainmenu.about"),
    });
    menuItems.push({
      component: Link,
      key: "privacy",
      to: "/privacy",
      onClick,
      children: t("mainmenu.privacy"),
    });
  }
  if (!account) {
    menuItems.push({
      key: "login",
      children: t("mainmenu.login"),
      onClick: () => navigate("/"),
    });
  } else {
    menuItems.push({
      children: (
        <>
          <AccountAvatarAsync icon={account.icon} sx={{ fontSize: 32 }} />
          {t("mainmenu.logout")}
        </>
      ),
      onClick: logout,
      key: "logout",
    });
  }
  if (amAnAdult) {
    menuItems.push({
      onClick: verifyAdult,
      variant: "contained",
      children: t("mainmenu.hideGrownups"),
      key: "hidegrownups",
    });
    menuItems.push({
      key: "donate",
      href: "https://www.buymeacoffee.com/hichess",
      children: t("mainmenu.donate"),
    });
  }

  return (
    <div className={css.root}>
      <Grid container spacing={2} className={css.grid}>
        {menuItems.map(({ key, ...item }) => (
          <Grid item xs={6} key={key}>
            <Button
              fullWidth
              variant="outlined"
              className={css.link}
              {...item}
            />
          </Grid>
        ))}
      </Grid>
      {showVerify ? <VerifyAdult onChange={handleVerify} /> : null}
      {!amAnAdult ? (
        <Button fullWidth onClick={verifyAdult} sx={{ marginTop: 2 }}>
          {t("mainmenu.grownups")}
        </Button>
      ) : null}
      {onClick ? (
        <IconButton onClick={onClick} sx={{ marginTop: 2 }}>
          <Cancel titleAccess={t("cancel")} sx={{ fontSize: 48 }} />
        </IconButton>
      ) : null}
    </div>
  );
}

export default MainMenu;
