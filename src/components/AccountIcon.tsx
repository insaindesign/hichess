import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { ReactComponent as Boy0 } from "../icons/boy0.svg";
import { ReactComponent as Boy1 } from "../icons/boy1.svg";
import { ReactComponent as Boy2 } from "../icons/boy2.svg";
import { ReactComponent as Boy3 } from "../icons/boy3.svg";
import { ReactComponent as Boy4 } from "../icons/boy4.svg";
import { ReactComponent as Boy5 } from "../icons/boy5.svg";
import { ReactComponent as Boy6 } from "../icons/boy6.svg";
import { ReactComponent as Boy7 } from "../icons/boy7.svg";
import { ReactComponent as Boy8 } from "../icons/boy8.svg";
import { ReactComponent as Boy9 } from "../icons/boy9.svg";
import { ReactComponent as Boy10 } from "../icons/boy10.svg";
import { ReactComponent as Boy11 } from "../icons/boy11.svg";
import { ReactComponent as Boy12 } from "../icons/boy12.svg";
import { ReactComponent as Boy13 } from "../icons/boy13.svg";
import { ReactComponent as Boy14 } from "../icons/boy14.svg";
import { ReactComponent as Boy15 } from "../icons/boy15.svg";
import { ReactComponent as Boy16 } from "../icons/boy16.svg";
import { ReactComponent as Girl0 } from "../icons/girl0.svg";
import { ReactComponent as Girl1 } from "../icons/girl1.svg";
import { ReactComponent as Girl2 } from "../icons/girl2.svg";
import { ReactComponent as Girl3 } from "../icons/girl3.svg";
import { ReactComponent as Girl4 } from "../icons/girl4.svg";
import { ReactComponent as Girl5 } from "../icons/girl5.svg";
import { ReactComponent as Girl6 } from "../icons/girl6.svg";
import { ReactComponent as Girl7 } from "../icons/girl7.svg";
import { ReactComponent as Girl8 } from "../icons/girl8.svg";
import { ReactComponent as Girl9 } from "../icons/girl9.svg";
import { ReactComponent as Girl10 } from "../icons/girl10.svg";
import { ReactComponent as Girl11 } from "../icons/girl11.svg";
import { ReactComponent as Girl12 } from "../icons/girl12.svg";
import { ReactComponent as Girl13 } from "../icons/girl13.svg";
import { ReactComponent as Girl14 } from "../icons/girl14.svg";
import { ReactComponent as Girl15 } from "../icons/girl15.svg";
import { ReactComponent as Girl16 } from "../icons/girl16.svg";

import type { FC } from "react";

export type IconName =
  | "boy0"
  | "boy1"
  | "boy2"
  | "boy3"
  | "boy4"
  | "boy5"
  | "boy6"
  | "boy7"
  | "boy8"
  | "boy9"
  | "boy10"
  | "boy11"
  | "boy12"
  | "boy13"
  | "boy14"
  | "boy15"
  | "boy16"
  | "girl0"
  | "girl1"
  | "girl2"
  | "girl3"
  | "girl4"
  | "girl5"
  | "girl6"
  | "girl7"
  | "girl8"
  | "girl9"
  | "girl10"
  | "girl11"
  | "girl12"
  | "girl13"
  | "girl14"
  | "girl15"
  | "girl16";

type Props = {
  icon: IconName;
} & SvgIconProps;

const nameToComponent: Record<IconName, FC> = {
  boy0: Boy0,
  boy1: Boy1,
  boy2: Boy2,
  boy3: Boy3,
  boy4: Boy4,
  boy5: Boy5,
  boy6: Boy6,
  boy7: Boy7,
  boy8: Boy8,
  boy9: Boy9,
  boy10: Boy10,
  boy11: Boy11,
  boy12: Boy12,
  boy13: Boy13,
  boy14: Boy14,
  boy15: Boy15,
  boy16: Boy16,
  girl0: Girl0,
  girl1: Girl1,
  girl2: Girl2,
  girl3: Girl3,
  girl4: Girl4,
  girl5: Girl5,
  girl6: Girl6,
  girl7: Girl7,
  girl8: Girl8,
  girl9: Girl9,
  girl10: Girl10,
  girl11: Girl11,
  girl12: Girl12,
  girl13: Girl13,
  girl14: Girl14,
  girl15: Girl15,
  girl16: Girl16,
};

export const accountIcons = Object.keys(nameToComponent) as IconName[];

function AccountIcon({ icon, ...props }: Props) {
  return (
    <SvgIcon {...props} component={nameToComponent[icon]} inheritViewBox />
  );
}

export default AccountIcon;
