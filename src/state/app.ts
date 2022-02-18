import { selector } from "recoil";
import { appStore } from "../storage";

export const appLoadedState = selector<boolean>({
  key: "appLoaded",
  get: () => appStore.getItem("loaded").then(() => true),
});
