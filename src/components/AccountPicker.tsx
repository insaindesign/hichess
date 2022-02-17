import { useCallback, useEffect, useState } from "react";
import {useRecoilState} from "recoil";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import AccountAdd from "./AccountAdd";
import AccountIcon from "./AsyncAccountIcon";
import { selectedAccountState, accountsState } from "../state/accounts";

import type { Account } from "../state/accounts";

import css from "./AccountPicker.module.css";

type Props = {};

function AccountPicker(props: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [account, setAccount] = useRecoilState(selectedAccountState);
  const [accounts, setAccounts] = useRecoilState(accountsState);

  useEffect(() => {
    if (account) {
      navigate("/menu");
    }
  }, [account, navigate]);

  const addAccount = useCallback(
    (account: Account) => {
      setAccounts([...accounts, account]);
      setShowAddAccount(false);
    },
    [accounts, setAccounts]
  );

  const toggleAddAccount = useCallback(() => {
    setShowAddAccount(!showAddAccount);
  }, [showAddAccount]);

  if (showAddAccount) {
    return <AccountAdd onAdd={addAccount} onCancel={toggleAddAccount} />;
  }

  return (
    <div className={css.root}>
      <img
        alt="HiChess"
        src="/icon-512.png"
        width={64}
        height={64}
        className={css.logo}
      />
      <div className={css.icons}>
        {accounts.map((account) => (
          <span key={account.id} className={css.icon}>
            <IconButton onClick={() => setAccount(account)}>
              <AccountIcon icon={account.icon} sx={{ fontSize: 96 }} />
            </IconButton>
            <div>{account.name}</div>
          </span>
        ))}
      </div>
      <Button
        size={accounts.length ? "medium" : "large"}
        variant={accounts.length ? "text" : "contained"}
        onClick={toggleAddAccount}
      >
        {t("account.add")}
      </Button>
      <Button component={Link} to="/privacy">
        {t("mainmenu.privacy")}
      </Button>
    </div>
  );
}

export default AccountPicker;