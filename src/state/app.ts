import { atom, selector } from "recoil";
import { appStore } from "../storage";

export const appLoadedState = selector<boolean>({
  key: "appLoaded",
  get: () => appStore.getItem("loaded").then(() => true),
});

export const menuOpenState = atom({
  key: 'menuOpen',
  default: false
});