import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as person0 } from "../icons/person0.svg";
import { ReactComponent as person1 } from "../icons/person1.svg";
import { ReactComponent as person2 } from "../icons/person2.svg";
import { ReactComponent as person3 } from "../icons/person3.svg";
import { ReactComponent as person4 } from "../icons/person4.svg";
import { ReactComponent as person5 } from "../icons/person5.svg";
import { ReactComponent as person6 } from "../icons/person6.svg";
import { ReactComponent as person7 } from "../icons/person7.svg";
import { ReactComponent as person8 } from "../icons/person8.svg";
import { ReactComponent as person9 } from "../icons/person9.svg";
import { ReactComponent as person10 } from "../icons/person10.svg";
import { ReactComponent as person11 } from "../icons/person11.svg";
import { ReactComponent as person12 } from "../icons/person12.svg";
import { ReactComponent as person13 } from "../icons/person13.svg";
import { ReactComponent as person14 } from "../icons/person14.svg";
import { ReactComponent as person15 } from "../icons/person15.svg";
import { ReactComponent as person16 } from "../icons/person16.svg";
import { ReactComponent as person17 } from "../icons/person17.svg";
import { ReactComponent as person19 } from "../icons/person19.svg";
import { ReactComponent as person20 } from "../icons/person20.svg";
import { ReactComponent as person21 } from "../icons/person21.svg";
import { ReactComponent as person22 } from "../icons/person22.svg";
import { ReactComponent as person23 } from "../icons/person23.svg";
import { ReactComponent as person24 } from "../icons/person24.svg";
import { ReactComponent as person25 } from "../icons/person25.svg";
import { ReactComponent as person26 } from "../icons/person26.svg";
import { ReactComponent as person27 } from "../icons/person27.svg";
import { ReactComponent as person28 } from "../icons/person28.svg";
import { ReactComponent as person29 } from "../icons/person29.svg";
import { ReactComponent as person30 } from "../icons/person30.svg";
import { ReactComponent as person31 } from "../icons/person31.svg";
import { ReactComponent as person32 } from "../icons/person32.svg";
import { ReactComponent as person33 } from "../icons/person33.svg";
import { ReactComponent as person34 } from "../icons/person34.svg";
import { ReactComponent as person35 } from "../icons/person35.svg";
import { ReactComponent as person36 } from "../icons/person36.svg";
import { ReactComponent as person37 } from "../icons/person37.svg";
import { ReactComponent as person38 } from "../icons/person38.svg";
import { ReactComponent as person39 } from "../icons/person39.svg";

import type { FC } from "react";
import type { IconName, Props } from "./AccountAvatarAsync";

const nameToComponent: Record<IconName, FC> = {
  person0,
  person1,
  person2,
  person3,
  person4,
  person5,
  person6,
  person7,
  person8,
  person9,
  person10,
  person11,
  person12,
  person13,
  person14,
  person15,
  person16,
  person17,
  person19,
  person20,
  person21,
  person22,
  person23,
  person24,
  person25,
  person26,
  person27,
  person28,
  person29,
  person30,
  person31,
  person32,
  person33,
  person34,
  person35,
  person36,
  person37,
  person38,
  person39,
};

function AccountAvatar({ icon, ...props }: Props) {
  return (
    <SvgIcon {...props} component={nameToComponent[icon]} inheritViewBox />
  );
}

export default AccountAvatar;
