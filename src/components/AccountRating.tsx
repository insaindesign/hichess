import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { eloStateForAccountId } from "../state/elo";
import AccountAvatarAsync from "./AccountAvatarAsync";
import EloChangeReaction from "./EloChangeReaction";

import type { Account } from "../state/accounts";
import type { EloCategory } from "../state/elo";
import { useEffect, useState } from "react";

type Props = {
  account: Account;
  type: EloCategory;
};

function AccountRating({ account, type }: Props) {
  const { eloState, eloLoadedState } = eloStateForAccountId(account.id);
  const elo = useRecoilValue(eloState(type));
  const eloLoaded = useRecoilValue(eloLoadedState(type));

  const [eloChange, setEloChange] = useState<number>(0);
  const [currentElo, setCurrentElo] = useState<number | null>(null);

  useEffect(() => {
    if (eloLoaded && elo !== currentElo) {
      if (currentElo !== null) {
        setEloChange(elo - currentElo);
      }
      setCurrentElo(elo);
    }
  }, [elo, currentElo, eloLoaded]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Chip
        avatar={<AccountAvatarAsync icon={account.icon} />}
        component={Link}
        label={elo}
        sx={{ fontWeight: 700 }}
        to="/profile"
      />
      <EloChangeReaction elo={elo} change={eloChange} />
    </Box>
  );
}

export default AccountRating;
