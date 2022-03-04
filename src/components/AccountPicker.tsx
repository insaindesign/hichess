import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AccountAdd from "./AccountAdd";
import AccountAvatar from "./AccountAvatarAsync";
import {
  selectedAccountState,
  accountsState,
  addAccountState,
} from "../state/accounts";

import css from "./AccountPicker.module.css";

type Props = {};

function AccountPicker(props: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [account, setAccount] = useRecoilState(selectedAccountState);
  const accounts = useRecoilValue(accountsState);
  const addAccount = useSetRecoilState(addAccountState);

  useEffect(() => {
    if (account) {
      navigate("/menu");
    }
  }, [account, navigate]);

  useEffect(() => {
    if (accounts.length) {
      setShowAddAccount(false);
    }
  }, [accounts]);

  const toggleAddAccount = useCallback(() => {
    setShowAddAccount(!showAddAccount);
  }, [showAddAccount]);

  if (showAddAccount) {
    return <AccountAdd onAdd={addAccount} onCancel={toggleAddAccount} />;
  }

  const hasAccounts = accounts.length;

  return (
    <>
      {hasAccounts ? (
        <div className={css.icons}>
          {accounts.map((account) => (
            <span key={account.id} className={css.icon}>
              <IconButton onClick={() => setAccount(account)}>
                <AccountAvatar icon={account.icon} sx={{ fontSize: 96 }} />
              </IconButton>
              <div>{account.name}</div>
            </span>
          ))}
        </div>
      ) : null}
      <IconButton
        color={hasAccounts ? "default" : "primary"}
        size={hasAccounts ? "medium" : "large"}
        onClick={toggleAddAccount}
      >
        <Add
          sx={{ fontSize: hasAccounts ? 48 : 96 }}
          titleAccess={t("account.add")}
        />
      </IconButton>
    </>
  );
}

export default AccountPicker;
