import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Toolbar from "../components/Toolbar";

type Props = {};

function AboutPage(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Toolbar title={t("about.title")} />
      <Container>
        <Typography variant="h3" paragraph>{t("about.description")}</Typography>
        <Typography variant="body1" paragraph>{t("about.description1")}</Typography>
      </Container>
    </>
  );
}

export default AboutPage;
