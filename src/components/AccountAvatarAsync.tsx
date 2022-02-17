import { lazy, Suspense } from "react";
import FaceIcon from '@mui/icons-material/Face';

import type { SvgIconProps } from "@mui/material/SvgIcon";

export type IconName =
  | "person0"
  | "person1"
  | "person2"
  | "person3"
  | "person4"
  | "person5"
  | "person6"
  | "person7"
  | "person8"
  | "person9"
  | "person10"
  | "person11"
  | "person12"
  | "person13"
  | "person14"
  | "person15"
  | "person16"
  | "person17"
  | "person19"
  | "person20"
  | "person21"
  | "person22"
  | "person23"
  | "person24"
  | "person25"
  | "person26"
  | "person27"
  | "person28"
  | "person29"
  | "person30"
  | "person31"
  | "person32"
  | "person33"
  | "person34"
  | "person35"
  | "person36"
  | "person37"
  | "person38"
  | "person39";

export type Props = {
  icon: IconName;
} & SvgIconProps;

export const accountIcons = [
  "person0",
  "person1",
  "person2",
  "person3",
  "person4",
  "person5",
  "person6",
  "person7",
  "person8",
  "person9",
  "person10",
  "person11",
  "person12",
  "person13",
  "person14",
  "person15",
  "person16",
  "person17",
  "person19",
  "person20",
  "person21",
  "person22",
  "person23",
  "person24",
  "person25",
  "person26",
  "person27",
  "person28",
  "person29",
  "person30",
  "person31",
  "person32",
  "person33",
  "person34",
  "person35",
  "person36",
  "person37",
  "person38",
  "person39",
].sort(() => Math.random() - Math.random()) as IconName[];

const LazyAccountAvatar = lazy(() => import("./AccountAvatar" /* webpackChunkName: "AccountAvatar" */));

function AccountAvatarAsync({ icon, ...props}: Props) {
  return (
    <Suspense fallback={<FaceIcon color="disabled" {...props} />}>
      <LazyAccountAvatar icon={icon} {...props} />
    </Suspense>
  );
}

export default AccountAvatarAsync;
