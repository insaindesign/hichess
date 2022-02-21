import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { appLoadedFetch } from "../state/app";
import { selectedAccountState } from "../state/accounts";
import Loading from "./Loading";

import type { Account } from "../state/accounts";

interface RequireAccountProps {
  account: Account;
}

interface Props<T> {
  Component: FC<T>;
  props: Omit<T, keyof RequireAccountProps>;
}

function RequireAccount<T>({ Component, props }: Props<T>) {
  const navigate = useNavigate();
  const account = useRecoilValue(selectedAccountState);
  appLoadedFetch();

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [navigate, account]);

  if (!account) {
    return <Loading />;
  }

  return <Component {...(props as T)} account={account} />;
}

export function withRequireAccount<T>(Component: FC<T>) {
  return (props: Omit<T, keyof RequireAccountProps>) => (
    <RequireAccount Component={Component} props={props} />
  );
}

export default RequireAccount;
