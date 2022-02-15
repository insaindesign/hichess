import { useTranslation } from "react-i18next";

import Learn from "./Learn";
import Toolbar from "./Toolbar";

type Props = {};

function LearnPage(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Toolbar>{t("learn.title")}</Toolbar>
      <Learn />
    </>
  );
}

export default LearnPage;
