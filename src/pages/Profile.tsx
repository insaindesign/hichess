import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

import Toolbar from "../components/Toolbar";
import AccountAvatarAsync from "../components/AccountAvatarAsync";
import { appLoadedState } from "../state/app";
import { selectedAccountState } from "../state/accounts";

function Profile() {
  const navigate = useNavigate();
  const account = useRecoilValue(selectedAccountState);
  const appLoaded = useRecoilValue(appLoadedState);

  useEffect(() => {
    if (appLoaded && !account) {
      navigate("/");
    }
  }, [appLoaded, account, navigate]);

  if (!account) {
    return null;
  }

  return (
    <>
      <Toolbar />
      <Box sx={{ textAlign: "center", paddingTop: 12 }}>
        <AccountAvatarAsync icon={account.icon} sx={{ fontSize: 128 }} />
        <Typography variant="h2" paragraph>
          {account.name}
        </Typography>
      </Box>
    </>
  );
}

export default Profile;
