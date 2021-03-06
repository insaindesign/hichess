import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import Toolbar from "../components/Toolbar";
import AccountAvatarAsync from "../components/AccountAvatarAsync";
import GameHistory from "../components/GameHistory";
import ProblemHistory from "../components/ProblemHistory";

import type { Account } from "../state/accounts";
import { withRequireAccount } from "../components/RequireAccount";
import { eloStateForAccountId } from "../state/elo";
import { useRecoilValue } from "recoil";

type Props = {
  account: Account
}

function Profile({ account }: Props) {
  const { overallEloState } = eloStateForAccountId(account.id);
  const overallElo = useRecoilValue(overallEloState);
  return (
    <>
      <Toolbar />
      <Box sx={{ textAlign: "center", paddingTop: 4 }}>
        <AccountAvatarAsync icon={account.icon} sx={{ fontSize: 128 }} />
        <Typography variant="h2">
          {account.name} <Chip sx={{ fontWeight: 700 }} label={overallElo} />
        </Typography>
        <GameHistory accountId={account.id} />
        <ProblemHistory accountId={account.id} type="puzzle" />
        <ProblemHistory accountId={account.id} type="learn" />
      </Box>
    </>
  );
}

export default withRequireAccount(Profile);
