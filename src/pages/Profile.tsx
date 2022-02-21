import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Toolbar from "../components/Toolbar";
import AccountAvatarAsync from "../components/AccountAvatarAsync";
import ProblemHistory from "../components/ProblemHistory";

import type { Account } from "../state/accounts";
import { withRequireAccount } from "../components/RequireAccount";

type Props = {
  account: Account
}

function Profile({ account }: Props) {
  return (
    <>
      <Toolbar />
      <Box sx={{ textAlign: "center", paddingTop: 12 }}>
        <AccountAvatarAsync icon={account.icon} sx={{ fontSize: 128 }} />
        <Typography variant="h2" paragraph>
          {account.name}
        </Typography>
        <ProblemHistory accountId={account.id} />
      </Box>
    </>
  );
}

export default withRequireAccount(Profile);
