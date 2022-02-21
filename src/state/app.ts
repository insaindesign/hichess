import { atom, selector } from "recoil";
import { appStore } from "../storage";

const appLoaded: {promise?: Promise<any>, complete: boolean } = {
  complete: false,
}
export const appLoadedFetch = () => {
  console.log('fetching');
  if (!appLoaded.promise) {
    appLoaded.promise = appStore.getItem("accounts");
    appLoaded.promise.then(() => {
      appLoaded.complete = true;
      console.log('complete');
    });
  }
  if (!appLoaded.complete) {
    throw appLoaded.promise;
  }
  return true;
};

export const appLoadedState = selector<boolean>({
  key: "appLoaded",
  get: () => appStore.getItem("loaded").then(() => true),
});

export const menuOpenState = atom({
  key: "menuOpen",
  default: false,
});
