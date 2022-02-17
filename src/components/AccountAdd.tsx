import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Cancel from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";

import AccountIcon, { accountIcons } from "./AsyncAccountIcon";

import type { Account } from "../state/accounts";
import type { IconName } from "./AsyncAccountIcon";

import css from "./AccountPicker.module.css";

type Props = {
  onAdd: (account: Account) => void;
  onCancel: () => void;
};

function AccountAdd({ onAdd, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<IconName | null>(null);

  const done = useCallback(() => {
    if (name && icon) {
      onAdd({ name, icon, id: String(Date.now()) });
    }
  }, [onAdd, name, icon]);

  const textChange = useCallback(
    (setter: (text: string) => void) => (e: any) => setter(e.target.value),
    []
  );

  return (
    <div className={css.root}>
      {!icon ? (
        <div className={css.icons}>
          {accountIcons.map((i) => (
            <ToggleButton
              value={i}
              key={i}
              onChange={() => setIcon(i)}
              selected={i === icon}
              title={i}
              sx={{ borderRadius: "50%", border: 0 }}
            >
              <AccountIcon icon={i} sx={{ fontSize: 64 }} />
            </ToggleButton>
          ))}
        </div>
      ) : (
        <>
          <IconButton onClick={() => setIcon(null)}>
            <AccountIcon icon={icon} sx={{ fontSize: 92 }} />
          </IconButton>
          <TextField
            placeholder={t("account.name")}
            autoFocus
            fullWidth
            value={name}
            onChange={textChange(setName)}
            inputProps={{ sx: { textAlign: "center", fontSize: 32 } }}
          />
          {icon ? (
            <Button
              disabled={!Boolean(name)}
              variant="contained"
              size="large"
              onClick={done}
            >
              {t("save")}
            </Button>
          ) : null}
        </>
      )}
      <IconButton onClick={onCancel}>
        <Cancel titleAccess={t("cancel")} sx={{ fontSize: 48 }} />
      </IconButton>
    </div>
  );
}

export default AccountAdd;
