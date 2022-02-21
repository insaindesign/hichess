import { atom } from "recoil";
import { appStore } from "../storage";

export const appLoadedFetch = (() => {
  let complete = false;
  let promise: Promise<any>;
  return () => {
    if (!promise) {
      promise = appStore.getItem("accounts");
      promise.then(() => (complete = true));
    }
    if (!complete) {
      throw promise;
    }
    return complete;
  };
})();

export const menuOpenState = atom({
  key: "menuOpen",
  default: false,
});
