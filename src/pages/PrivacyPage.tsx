import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import Toolbar from "../components/Toolbar";

type Props = {};

function PrivacyPage(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Toolbar>{t("privacy.title")}</Toolbar>
      <Container>
        <Typography variant="h4" paragraph>{t("privacy.description")}</Typography>
        <Typography variant="body1" paragraph>{t("privacy.description1")}</Typography>
      </Container>
    </>
  );
}

export default PrivacyPage;
