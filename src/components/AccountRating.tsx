import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { eloStateForAccountId } from "../state/elo";
import AccountAvatarAsync from "./AccountAvatarAsync";
import EloChangeReaction from "./EloChangeReaction";

import type { Account } from "../state/accounts";
import type { EloCategory } from "../state/elo";
import { Suspense, useEffect, useState } from "react";

type Props = {
  account: Account;
  type: EloCategory;
};

type ChipProps = {
  account: Account;
  label: string | number;
};

function AccountChip({ account, label }: ChipProps) {
  return (
    <Chip
      avatar={<AccountAvatarAsync icon={account.icon} />}
      component={Link}
      label={label}
      sx={{ fontWeight: 700 }}
      to="/profile"
    />
  );
}

function AccountRating({ account, type }: Props) {
  const { eloState, eloLoadedState } = eloStateForAccountId(account.id);
  const elo = useRecoilValue(eloState(type));
  useRecoilValue(eloLoadedState(type)); // suspends

  const [eloChange, setEloChange] = useState<number>(0);
  const [currentElo, setCurrentElo] = useState<number | null>(null);

  useEffect(() => {
    if (elo !== currentElo) {
      if (currentElo !== null) {
        setEloChange(elo - currentElo);
      }
      setCurrentElo(elo);
    }
  }, [elo, currentElo]);

  return (
    <Box sx={{ position: "relative" }}>
      <AccountChip account={account} label={elo} />
      <EloChangeReaction elo={elo} change={eloChange} />
    </Box>
  );
}

const AccountRatingSuspended = ({ account, type }: Props) => (
  <Suspense fallback={<AccountChip account={account} label="..." />}>
    <AccountRating account={account} type={type} />
  </Suspense>
);

export default AccountRatingSuspended;
